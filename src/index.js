import * as core from '@actions/core';
import {
  handleBranchesOption,
  handleDryRunOption,
  handleCiOption,
  handleExtends,
  handleTagFormat,
  handleRepositoryUrlOption,
} from './handleOptions.js';
import setUpJob from './setUpJob.task.js';
import installSpecifyingVersionSemantic from './installSpecifyingVersionSemantic.task.js';
import preInstall from './preInstall.task.js';
import cleanupNpmrc from './cleanupNpmrc.task.js';
import windUpJob from './windUpJob.task.js';
import inputs from './inputs.json' with { type: 'json' };;

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

export default async () => {
  core.debug('Initialization successful');
  release().catch(core.setFailed);
};
