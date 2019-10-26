const path = require('path');
const core = require('@actions/core');
const exec = require('./_exec');

/**
 * Pre-install plugins
 * @returns {Promise<never>}
 */
module.exports = async () => {
  const extraPlugins = core.getInput('extra_plugins', {required: false}) || '';

  if (extraPlugins) {
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
  }
};
