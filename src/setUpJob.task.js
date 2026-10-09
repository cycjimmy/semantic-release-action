import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import * as core from '@actions/core';
import outputs from './outputs.json' with { type: 'json' };

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * setUpJob
 * @returns {Promise<void>}
 */
export default async () => {
  // set defaults for all outputs so they always exist
  Object.values(outputs).forEach((output) => {
    core.setOutput(output, '');
  });
  core.setOutput(outputs.new_release_published, 'false');

  core.debug('action_workspace: ' + path.resolve(__dirname, '..'));
  core.debug('process.cwd: ' + process.cwd());
};
