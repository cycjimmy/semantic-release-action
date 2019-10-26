const path = require('path');
const core = require('@actions/core');
const exec = require('./_exec');
const inputs = require('./inputs.json');

/**
 * Pre-install plugins
 * @returns {Promise<void>}
 */
module.exports = async () => {
  const extraPlugins = core.getInput(inputs.extra_plugins);

  if (!extraPlugins) {
    return Promise.resolve();
  }

  const _extraPlugins = extraPlugins
    .replace(/['"]/g, '')
    .replace(/[\n\r]/g, ' ');

  const {stdout, stderr} = await exec(`npm install ${_extraPlugins}`, {
    cwd: path.resolve(__dirname)
  });
  core.debug(stdout);

  if (stderr) {
    return Promise.reject(stderr);
  }
};
