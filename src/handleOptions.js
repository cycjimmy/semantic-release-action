import * as core from '@actions/core';
import stringToJson from './stringToJson.js';
import inputs from './inputs.json' with { type: 'json' };

/**
 * Handle Branches Option
 * @returns {{}|{branches: string|Array}}
 */
export const handleBranchesOption = () => {
  const branchesOption = {};
  const branches = core.getInput(inputs.branches);
  core.debug(`branches input: ${branches}`);

  if (!branches) {
    return branchesOption;
  }

  const jsonOrStr = stringToJson('' + branches);
  core.debug(`Converted branches attribute: ${JSON.stringify(jsonOrStr)}`);
  branchesOption.branches = jsonOrStr;
  return branchesOption;
};

/**
 * Warn about removed legacy inputs. The `branch` input is no longer declared
 * in action.yml; the runner still exports it as INPUT_BRANCH when users pass it.
 */
export const warnDeprecatedInputs = () => {
  // hardcoded: 'branch' was removed from inputs.json
  const branch = core.getInput('branch');

  if (branch) {
    core.warning(
      `The 'branch' input is no longer supported and will be ignored. ` +
      `Use the 'branches' input instead (requires semantic-release v16 or above). ` +
      `See https://semantic-release.gitbook.io/semantic-release/usage/configuration#branches`
    );
  }
};

/**
 * Handle DryRun Option
 * @returns {{}|{dryRun: boolean}}
 */
export const handleDryRunOption = () => {
  const dryRun = core.getInput(inputs.dry_run);
  core.debug(`dryRun input: ${dryRun}`);

  switch (dryRun) {
    case 'true':
      return {dryRun: true};

    case 'false':
      return {dryRun: false};

    default:
      return {};
  }
};

/**
 * Handle Ci Option
 * @returns {{}|{ci: boolean}}
 */
export const handleCiOption = () => {
  const ci = core.getInput(inputs.ci);
  core.debug(`ci input: ${ci}`);

  switch (ci) {
    case 'true':
      return { ci: true, noCi: false };

    case 'false':
      return { ci: false, noCi: true };

    default:
      return {};
  }
};

/**
 * Handle Extends Option
 * @returns {{}|{extends: Array}|{extends: String}}
 */
export const handleExtends = () => {
  const extend = core.getInput(inputs.extends);
  core.debug(`extend input: ${extend}`);

  if (extend) {
    const extendModuleNames = extend.split(/\r?\n/)
      .map((name) => name.replace(/(?<!^)@.+/, ''))
    return {
      extends: extendModuleNames
    };
  } else {
    return {};
  }
};

/**
 * Handle TagFormat Option
 * @returns {{}|{tagFormat: String}}
 */
export const handleTagFormat = () => {
  const tagFormat = core.getInput(inputs.tag_format);
  core.debug(`tagFormat input: ${tagFormat}`);

  if (tagFormat) {
    return {
      tagFormat
    };
  } else {
    return {};
  }
};

/**
 * Handle repository-url Option
 * @returns {{}|{repositoryUrl: String}}
 */
export const handleRepositoryUrlOption = () => {
  const repositoryUrl = core.getInput(inputs.repository_url);
  core.debug(`repository_url input: ${repositoryUrl}`);

  if (repositoryUrl) {
    return { repositoryUrl };
  } else {
    return {};
  }
};
