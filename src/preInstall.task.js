import path, {dirname} from 'path';
import { fileURLToPath } from 'url';
import * as core from '@actions/core';
import runNpm from './runNpm.js';
import isNpmSpec from './isNpmSpec.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Pre-install extra dependecies
 * @returns {Promise<void>}
 */
export default async extras => {
  if (!extras) {
    return Promise.resolve();
  }

  // Split into tokens and keep only plausible npm package specs: specs are
  // passed to npm without a shell, and tokens starting with `-` are dropped
  // so they can never be read as npm options
  const extrasList = extras
    .replace(/['"]/g, '')
    .split(/\s+/)
    .filter(Boolean);
  const validSpecs = extrasList.filter((spec) => isNpmSpec(spec));
  const invalidTokens = extrasList.filter((spec) => !isNpmSpec(spec));

  if (invalidTokens.length) {
    core.warning(`Ignored invalid package specs: ${invalidTokens.join(', ')}`);
  }

  if (!validSpecs.length) {
    return Promise.resolve();
  }

  core.debug(`Installing extra packages: ${validSpecs.join(', ')}`);

  // Keep the install output quiet, but still let npm print real errors
  // (e.g. ERESOLVE peer dependency reports) to stderr; --silent would
  // swallow them, leaving only an opaque "Command failed" message
  const quietArgs = process.env.RUNNER_DEBUG === '1' ? [] : ['--loglevel', 'error'];
  const args = ['install', ...validSpecs, '--no-audit', ...quietArgs];

  const { stdout, stderr } = await runNpm(args, {
    cwd: path.resolve(__dirname, '..')
  });
  core.debug(stdout);
  core.error(stderr);
};
