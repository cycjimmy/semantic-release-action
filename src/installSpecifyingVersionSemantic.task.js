import path from 'path';
import * as core from '@actions/core';
import exec from './_exec';
import inputs from './inputs.json';

/**
 * Install Specifying Version semantic-release
 * @returns {Promise<void>}
 */
module.exports = async () => {
  const semantic_version = core.getInput(inputs.semantic_version);
  const versionSuffix = semantic_version
    ? `@${semantic_version}`
    : '';

  const {stdout, stderr} = await exec(`npm install semantic-release${versionSuffix} --no-audit --silent`, {
    cwd: path.resolve(__dirname, '..')
  });
  core.debug(stdout);
  core.error(stderr);
};
