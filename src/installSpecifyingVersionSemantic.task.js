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

  if (!semantic_version) {
    return Promise.resolve();
  }

  const {stdout, stderr} = await exec(`npm install semantic-release@${semantic_version}`, {
    cwd: path.resolve(__dirname, '..')
  });
  core.debug(stdout);

  if (stderr) {
    return Promise.reject(stderr);
  }
};
