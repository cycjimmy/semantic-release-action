const core = require('@actions/core');
const outputs = require('./outputs.json');

/**
 * setUpJob
 * @returns {Promise<void>}
 */
module.exports = async () => {
  // set outputs default
  core.setOutput(outputs.new_release_published, 'false');

  return Promise.resolve();
};
