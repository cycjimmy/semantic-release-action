const path = require('path');
const core = require('@actions/core');
const exec = require('./_exec');

/**
 * Pre-install extra dependecies
 * @returns {Promise<void>}
 */
module.exports = async extras => {
  if (!extras) {
    return Promise.resolve();
  }

  const _extras = extras.replace(/['"]/g, '').replace(/[\n\r]/g, ' ');

  const { stdout, stderr } = await exec(`npm install ${_extras} --silent`, {
    cwd: path.resolve(__dirname, '..')
  });
  core.debug(stdout);
  core.error(stderr);
};
