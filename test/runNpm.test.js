import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {test} from 'node:test';
import runNpm, {resolveNpm} from '../src/runNpm.js';

// Creates the npm-cli.js of a fake Node installation layout below `dir`:
// - windowsLayout: <dir>/node_modules/npm/bin/npm-cli.js
// - otherwise:     <dir>/lib/node_modules/npm/bin/npm-cli.js
const createNpmCli = (dir, {nodeExe = false, windowsLayout = true} = {}) => {
  const npmCliPath = windowsLayout
    ? path.join(dir, 'node_modules', 'npm', 'bin', 'npm-cli.js')
    : path.join(dir, 'lib', 'node_modules', 'npm', 'bin', 'npm-cli.js');
  fs.mkdirSync(path.dirname(npmCliPath), {recursive: true});
  fs.writeFileSync(npmCliPath, '');
  if (nodeExe) {
    fs.writeFileSync(path.join(dir, 'node.exe'), '');
  }
  return npmCliPath;
};

const createTempDir = () =>
  fs.mkdtempSync(path.join(os.tmpdir(), 'runnpm-test-'));

const removeDirs = (dirs) => {
  for (const dir of dirs) {
    fs.rmSync(dir, {recursive: true, force: true});
  }
};

test('resolveNpm finds the npm-cli.js bundled with the running Node (POSIX layout)', () => {
  const root = createTempDir();
  try {
    const execPath = path.join(root, 'bin', 'node');
    const npmCliPath = createNpmCli(root, {windowsLayout: false});
    assert.deepEqual(resolveNpm({platform: 'linux', execPath, pathEnv: ''}), {
      npmCliPath,
      nodePath: execPath
    });
  } finally {
    removeDirs([root]);
  }
});

test('resolveNpm returns null on POSIX without bundled npm (PATH npm fallback)', () => {
  const root = createTempDir();
  try {
    const execPath = path.join(root, 'bin', 'node');
    assert.equal(resolveNpm({platform: 'linux', execPath, pathEnv: '/usr/bin'}), null);
  } finally {
    removeDirs([root]);
  }
});

test('resolveNpm finds the npm-cli.js bundled with the running Node (Windows layout)', () => {
  const root = createTempDir();
  try {
    const execPath = path.join(root, 'node.exe');
    const npmCliPath = createNpmCli(root);
    assert.deepEqual(resolveNpm({platform: 'win32', execPath, pathEnv: ''}), {
      npmCliPath,
      nodePath: execPath
    });
  } finally {
    removeDirs([root]);
  }
});

test('resolveNpm scans PATH in order for a Node installation bundling npm on Windows', () => {
  const runnerDir = createTempDir();
  const withoutNpmDir = createTempDir();
  const withNpmDir = createTempDir();
  try {
    // The action runs on the runner's Node, which has no bundled npm;
    // the winning PATH entry is quoted, as Windows PATH entries may be
    const execPath = path.join(runnerDir, 'node.exe');
    const npmCliPath = createNpmCli(withNpmDir, {nodeExe: true});
    const pathEnv = [runnerDir, withoutNpmDir, `"${withNpmDir}"`].join(';');
    assert.deepEqual(resolveNpm({platform: 'win32', execPath, pathEnv}), {
      npmCliPath,
      nodePath: path.join(withNpmDir, 'node.exe')
    });
  } finally {
    removeDirs([runnerDir, withoutNpmDir, withNpmDir]);
  }
});

test('resolveNpm falls back to the running Node when a PATH entry ships no node.exe', () => {
  const runnerDir = createTempDir();
  const withNpmDir = createTempDir();
  try {
    const execPath = path.join(runnerDir, 'node.exe');
    const npmCliPath = createNpmCli(withNpmDir);
    const pathEnv = [runnerDir, withNpmDir].join(';');
    assert.deepEqual(resolveNpm({platform: 'win32', execPath, pathEnv}), {
      npmCliPath,
      nodePath: execPath
    });
  } finally {
    removeDirs([runnerDir, withNpmDir]);
  }
});

test('resolveNpm returns null on Windows when no Node installation bundles npm', () => {
  const runnerDir = createTempDir();
  const withoutNpmDir = createTempDir();
  try {
    const execPath = path.join(runnerDir, 'node.exe');
    const pathEnv = [runnerDir, withoutNpmDir].join(';');
    assert.equal(resolveNpm({platform: 'win32', execPath, pathEnv}), null);
  } finally {
    removeDirs([runnerDir, withoutNpmDir]);
  }
});

test('runNpm runs a real npm command through a resolved npm-cli.js', async () => {
  const {stdout} = await runNpm(['--version']);
  assert.match(stdout.trim(), /^\d+\.\d+\.\d+$/);
});
