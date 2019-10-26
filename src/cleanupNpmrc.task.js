const core = require('@actions/core');
const exec = require('./_exec');

/**
 * Clean up `.npmrc` file in the repo after releasing
 * @returns {Promise<never>}
 */
module.exports = async () => {
  const {stdout, stderr} = await exec(`rm -f .npmrc`);
  core.debug(stdout);

  if (stderr) {
    return Promise.reject(stderr);
  }
};
