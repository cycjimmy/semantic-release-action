import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { execFile } from 'child_process';

const execFileAsync = promisify(execFile);

// npm's cli entry bundled with a Node distribution. Running npm through a
// Node executable keeps the invocation shell-free on every platform
// (spawning `npm.cmd` on Windows would require a shell).
//
// A JavaScript action executes on the Node runtime bundled with the runner,
// which does not ship npm, so the entry next to `process.execPath` is
// usually missing there. On Windows there is no shell-free `npm` fallback
// (it is a .cmd shim), so PATH is scanned for a Node installation that
// bundles npm, the layout actions/setup-node and the official Node
// installer provide.
export const resolveNpm = ({
  platform = process.platform,
  execPath = process.execPath,
  pathEnv = process.env.PATH
} = {}) => {
  const nodeDir = path.dirname(execPath);

  // Layout of the official Node distributions:
  // - Windows: <node-dir>/node_modules/npm/bin/npm-cli.js
  // - POSIX:   <node-dir>/../lib/node_modules/npm/bin/npm-cli.js
  const bundledNpmCliPath = platform === 'win32'
    ? path.join(nodeDir, 'node_modules', 'npm', 'bin', 'npm-cli.js')
    : path.join(nodeDir, '..', 'lib', 'node_modules', 'npm', 'bin', 'npm-cli.js');

  if (fs.existsSync(bundledNpmCliPath)) {
    return {npmCliPath: bundledNpmCliPath, nodePath: execPath};
  }

  if (platform !== 'win32') {
    // No bundled npm next to the running Node: the caller falls back to
    // the plain `npm` executable from PATH, a shebang script that spawns
    // without a shell on POSIX
    return null;
  }

  // Windows only: scan PATH in order for a Node installation bundling npm
  for (const rawDir of (pathEnv || '').split(';')) {
    // PATH entries may be quoted (e.g. "C:\Program Files\nodejs")
    const dir = rawDir.replace(/^"|"$/g, '');
    if (!dir) {
      continue;
    }

    const npmCliPath = path.join(dir, 'node_modules', 'npm', 'bin', 'npm-cli.js');
    if (!fs.existsSync(npmCliPath)) {
      continue;
    }

    // Prefer the node.exe shipped with that installation so npm and the
    // processes it spawns run on the Node the workflow set up
    const nodePath = path.join(dir, 'node.exe');
    return {
      npmCliPath,
      nodePath: fs.existsSync(nodePath) ? nodePath : execPath
    };
  }

  return null;
};

/**
 * Run npm with the given argument list without a shell.
 * Every argument is passed as a single argv element, so user-provided
 * package specs can never be interpreted as shell commands.
 * @param {string[]} args
 * @param {Object} [options] child_process options (e.g. cwd)
 * @returns {Promise<{stdout: string, stderr: string}>}
 */
export default async (args, options = {}) => {
  const resolved = resolveNpm();

  if (resolved) {
    return execFileAsync(resolved.nodePath, [resolved.npmCliPath, ...args], options);
  }

  if (process.platform === 'win32') {
    // `npm` on Windows is npm.cmd, which cannot be spawned without a shell.
    // Fail with a clear message instead of an opaque ENOENT.
    throw new Error(
      'Unable to locate npm-cli.js on Windows. ' +
      'semantic-release-action requires a Node installation bundled with npm; ' +
      'none was found next to the running Node executable or in PATH.'
    );
  }

  // Non-Windows fallback: plain `npm` executable from PATH
  return execFileAsync('npm', args, options);
};
