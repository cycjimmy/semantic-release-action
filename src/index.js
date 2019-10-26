const core = require('@actions/core');
const semanticRelease = require('semantic-release');
const {handleDryRunOption} = require('./handleOptions');
const preInstallPlugins = require('./preInstallPlugins.task');
const cleanupNpmrc = require('./cleanupNpmrc.task');
const windUpJob = require('./windUpJob.task');

const outputs = require('./outputs.json');
const inputs = require('./inputs.json');

/**
 * Release main task
 * @returns {Promise<void>}
 */
const release = async () => {
  // set outputs default
  core.setOutput(outputs.new_release_published, 'false');

  const branch = core.getInput(inputs.branch, {required: false}) || 'master';

  await preInstallPlugins();

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
