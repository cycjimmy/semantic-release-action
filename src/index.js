import * as core from '@actions/core';
import {
  handleBranchesOption,
  handleDryRunOption,
  handleCiOption,
  handleExtends,
  handleTagFormat,
  handleRepositoryUrlOption,
} from './handleOptions';
import setUpJob from './setUpJob.task';
import installSpecifyingVersionSemantic from './installSpecifyingVersionSemantic.task';
import preInstall from './preInstall.task';
import cleanupNpmrc from './cleanupNpmrc.task';
import windUpJob from './windUpJob.task';
import inputs from './inputs.json';

/**
 * Release main task
 * @returns {Promise<void>}
 */
const release = async () => {
  if (core.getInput(inputs.working_directory)) {
    process.chdir(core.getInput(inputs.working_directory));
  }
  await setUpJob();
  await installSpecifyingVersionSemantic();
  await preInstall(core.getInput(inputs.extra_plugins));
  await preInstall(core.getInput(inputs.extends));

  if (core.getInput(inputs.unset_gha_env) === 'true') {
    core.debug('Unset GITHUB_ACTIONS environment variable');
    delete process.env.GITHUB_ACTIONS;
  }

  const semanticRelease = await import('semantic-release');
  const result = await semanticRelease.default({
    ...handleBranchesOption(),
    ...handleDryRunOption(),
    ...handleCiOption(),
    ...handleExtends(),
    ...handleTagFormat(),
    ...handleRepositoryUrlOption()
  });

  await cleanupNpmrc();
  await windUpJob(result);
};

module.exports = () => {
  core.debug('Initialization successful');
  release().catch(core.setFailed);
};
