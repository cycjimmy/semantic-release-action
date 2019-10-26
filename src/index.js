const core = require('@actions/core');
const semanticRelease = require('semantic-release');
const {handleDryRunOption} = require('./handleOptions');
const setUpJob = require('./setUpJob.task');
const preInstallPlugins = require('./preInstallPlugins.task');
const cleanupNpmrc = require('./cleanupNpmrc.task');
const windUpJob = require('./windUpJob.task');

const inputs = require('./inputs.json');

/**
 * Release main task
 * @returns {Promise<void>}
 */
const release = async () => {
  await setUpJob();
  await preInstallPlugins();

  const branch = core.getInput(inputs.branch) || 'master';
  const result = await semanticRelease({
    branch,
    ...(handleDryRunOption()),
  });

  await cleanupNpmrc();
  await windUpJob(result);
};

module.exports = () => {
  core.debug('Initialization successful');
  release().catch(core.setFailed);
};
