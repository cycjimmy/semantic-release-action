import path from 'path';
import * as core from '@actions/core';
import outputs from './outputs.json';

/**
 * setUpJob
 * @returns {Promise<void>}
 */
module.exports = async () => {
  // set outputs default
  core.setOutput(outputs.new_release_published, 'false');

  core.debug('action_workspace: ' + path.resolve(__dirname, '..'));
  core.debug('process.cwd: ' + process.cwd());

  return Promise.resolve();
};
