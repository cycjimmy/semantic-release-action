const exec = require('./_exec');
const path = require('path');
const core = require('@actions/core');
const semanticRelease = require('semantic-release');

const OutputKey_NewReleasePublished = 'new-release-published';

/**
 * handleDryRunOption
 * @returns {{}|{dryRun: boolean}}
 */
const handleDryRunOption = () => {
  const dryRun = core.getInput('dry_run', {required: false}) || '';

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
 * Release main task
 * @returns {Promise<Promise<never>|undefined>}
 */
const release = async () => {
  const branch = core.getInput('branch', {required: false}) || 'master';
  const extraPlugins = core.getInput('extra_plugins', {required: false}) || '';

  // set outputs default
  core.setOutput(OutputKey_NewReleasePublished, 'false');

  // pre-install plugins
  if (extraPlugins) {
    const _extraPlugins = extraPlugins
      .replace(/['"]/g, '')
      .replace(/[\n\r]/g, ' ');
    const {stdout, stderr} = await exec(`npm install ${_extraPlugins}`, {
      cwd: path.resolve(__dirname)
    });
    core.debug(stdout);
    if (stderr) {
      return Promise.reject(stderr);
    }
  }

  const result = await semanticRelease({
    branch,
    ...(handleDryRunOption()),
  });

  if (!result) {
    core.debug('No release published.');
    return;
  }

  const {lastRelease, commits, nextRelease, releases} = result;

  core.debug(`Published ${nextRelease.type} release version ${nextRelease.version} containing ${commits.length} commits.`);

  if (lastRelease.version) {
    core.debug(`The last release was "${lastRelease.version}".`);
  }

  for (const release of releases) {
    core.debug(`The release was published with plugin "${release.pluginName}".`);
  }

  // set outputs default
  core.setOutput(OutputKey_NewReleasePublished, 'true');
};


module.exports = () => {
  core.debug('Initialization successful');
  release().catch(core.setFailed);
};
