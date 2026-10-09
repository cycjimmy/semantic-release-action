import * as core from '@actions/core';
import runNpm from './runNpm.js';
import isNpmSpec from './isNpmSpec.js';
import inputs from './inputs.json' with { type: 'json' };
import path, {dirname} from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Install Specifying Version semantic-release
 * @returns {Promise<void>}
 */
export default async () => {
  const semantic_version = core.getInput(inputs.semantic_version);

  // Reject implausible version specs early (also prevents silently falling
  // back to "latest"); the spec is passed to npm without a shell
  if (semantic_version && !isNpmSpec(semantic_version)) {
    throw new Error(`Invalid semantic_version input: ${semantic_version}`);
  }

  const versionSuffix = semantic_version
    ? `@${semantic_version}`
    : '';

  const {stdout, stderr} = await runNpm(
    ['install', `semantic-release${versionSuffix}`, '--no-audit', '--silent'],
    {
      cwd: path.resolve(__dirname, '..')
    }
  );
  core.debug(stdout);
  core.error(stderr);
};
