const path = require('path');
const core = require('@actions/core');
const exec = require('./_exec');
const inputs = require('./inputs.json');

/**
 * Install Specifying Version semantic-release
 * @returns {Promise<void>}
 */
module.exports = async () => {
  const semantic_version = core.getInput(inputs.semantic_version);
  const versionSuffix = semantic_version
    ? `@${semantic_version}`
    : '';

  const {stdout, stderr} = await exec(`npm install semantic-release${versionSuffix} --silent`, {
    cwd: path.resolve(__dirname, '..')
  });
  core.debug(stdout);
  core.error(stderr);
};
