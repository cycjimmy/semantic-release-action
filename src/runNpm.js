import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { execFile } from 'child_process';

const execFileAsync = promisify(execFile);

// npm's cli entry bundled with the running Node distribution. Running npm
// through the current Node executable keeps the invocation shell-free on
// every platform (spawning `npm.cmd` on Windows would require a shell).
const resolveNpmCliPath = () => {
  const nodeDir = path.dirname(process.execPath);

  // Layout of the official Node distributions:
  // - Windows: <node-dir>/node_modules/npm/bin/npm-cli.js
  // - POSIX:   <node-dir>/../lib/node_modules/npm/bin/npm-cli.js
  const npmCliPath = process.platform === 'win32'
    ? path.join(nodeDir, 'node_modules', 'npm', 'bin', 'npm-cli.js')
    : path.join(nodeDir, '..', 'lib', 'node_modules', 'npm', 'bin', 'npm-cli.js');

  return fs.existsSync(npmCliPath) ? npmCliPath : '';
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
  const npmCliPath = resolveNpmCliPath();

  if (npmCliPath) {
    return execFileAsync(process.execPath, [npmCliPath, ...args], options);
  }

  if (process.platform === 'win32') {
    // `npm` on Windows is npm.cmd, which cannot be spawned without a shell.
    // Fail with a clear message instead of an opaque ENOENT.
    throw new Error(
      'Unable to locate npm-cli.js for the current Node installation on Windows. ' +
      'semantic-release-action requires Node to be installed with npm bundled.'
    );
  }

  // Non-Windows fallback: plain `npm` executable from PATH
  return execFileAsync('npm', args, options);
};
