const exec = require('./_exec');
const path = require('path');
const {WritableStreamBuffer} = require('stream-buffers');

const core = require('@actions/core');
const semanticRelease = require('semantic-release');

const release = async () => {
  const branch = core.getInput('branch', {required: false}) || 'master';
  const extraPlugins = core.getInput('extra_plugins', {required: false}) || '';

  // pre-install plugins
  if (extraPlugins) {
    const _extraPlugins = extraPlugins
      .replace(/['"]/g, '')
      .replace(/[\n\r]/g, ' ');
    const {stdout, stderr} = await exec(`npm install ${_extraPlugins}`, {
      cwd: path.resolve(__dirname)
    });
    console.log(stdout);
    if (stderr) {
      return Promise.reject(stderr);
    }
  }

  const result = await semanticRelease({branch});

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
};


module.exports = () => {
  release().catch(core.setFailed);
};
