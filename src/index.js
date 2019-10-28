const core = require('@actions/core');
const semanticRelease = require('semantic-release');
const {handleBranchOption, handleDryRunOption} = require('./handleOptions');
const setUpJob = require('./setUpJob.task');
const preInstallPlugins = require('./preInstallPlugins.task');
const cleanupNpmrc = require('./cleanupNpmrc.task');
const windUpJob = require('./windUpJob.task');

/**
 * Release main task
 * @returns {Promise<void>}
 */
const release = async () => {
  await setUpJob();
  await preInstallPlugins();

  const result = await semanticRelease({
    ...(handleBranchOption()),
    ...(handleDryRunOption()),
  });

  await cleanupNpmrc();
  await windUpJob(result);
};

module.exports = () => {
  core.debug('Initialization successful');
  release().catch(core.setFailed);
};
