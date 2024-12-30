const core = require('@actions/core');
const stringToJson = require('@cycjimmy/awesome-js-funcs/cjs/typeConversion/stringToJson.cjs').default;
const inputs = require('./inputs.json');

/**
 * Handle Branches Option
 * @returns {{}|{branch: string}}
 */
exports.handleBranchesOption = () => {
  const branchesOption = {};
  const branches = core.getInput(inputs.branches);
  const branch = core.getInput(inputs.branch);

  core.debug(`branches input: ${branches}`);
  core.debug(`branch input: ${branch}`);

  const semanticVersion = require('semantic-release/package.json').version;
  const semanticMajorVersion = Number(semanticVersion.replace(/\..+/g, ''));
  core.debug(`semanticMajorVersion: ${semanticMajorVersion}`);

  // older than v16
  if (semanticMajorVersion < 16) {
    if (!branch) {
      return branchesOption;
    }

    branchesOption.branch = branch;
    return branchesOption;
  }

  // above v16
  const strNeedConvertToJson = branches || branch || '';

  if (!strNeedConvertToJson) {
    return branchesOption;
  }

  const jsonOrStr = stringToJson('' + strNeedConvertToJson);
  core.debug(`Converted branches attribute: ${JSON.stringify(jsonOrStr)}`);
  branchesOption.branches = jsonOrStr;
  return branchesOption;
};

/**
 * Handle DryRun Option
 * @returns {{}|{dryRun: boolean}}
 */
exports.handleDryRunOption = () => {
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
exports.handleCiOption = () => {
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
exports.handleExtends = () => {
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
exports.handleTagFormat = () => {
  const tagFormat = core.getInput(inputs.tag_format);
  core.debug(`citagFormat input: ${tagFormat}`);

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
 * @returns {{}|{r: String}}
 */
exports.handleRepositoryUrlOption = () => {
  const repositoryUrl = core.getInput(inputs.repository_url);
  core.debug(`repository_url input: ${repositoryUrl}`);

  if (repositoryUrl) {
    return { r: repositoryUrl };
  } else {
    return {};
  }
};
