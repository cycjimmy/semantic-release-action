const exec = require('./_exec');
const path = require('path');
const core = require('@actions/core');
const semanticRelease = require('semantic-release');

const OutputKeys = {
  newReleasePublished: 'new-release-published',
  newReleaseVersion: 'new-release-version',
  newReleaseMajor: 'new-release-major-version',
  newReleaseMinor: 'new-release-minor-version',
  newReleasePatch: 'new-release-patch-version',
};

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
  core.setOutput(OutputKeys.newReleasePublished, 'false');

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

  const {version} = nextRelease;
  const [major, minor, patch] = version.split('.');

  // set outputs
  core.setOutput(OutputKeys.newReleasePublished, 'true');
  core.setOutput(OutputKeys.newReleaseVersion, version);
  core.setOutput(OutputKeys.newReleaseMajor, major);
  core.setOutput(OutputKeys.newReleaseMinor, minor);
  core.setOutput(OutputKeys.newReleasePatch, patch);
};


module.exports = () => {
  core.debug('Initialization successful');
  release().catch(core.setFailed);
};
