import * as core from '@actions/core';

const MINIMUM_MAJOR_VERSION = 16;

/**
 * Assert the installed semantic-release version is supported (v16 or above)
 * @returns {Promise<void>}
 * @throws {Error} when the installed semantic-release major version is below the minimum
 */
export default async () => {
  const { default: { version } } = await import('semantic-release/package.json', { with: { type: 'json' } });
  const majorVersion = Number(version.replace(/\..+/g, ''));
  core.debug(`semantic-release version: ${version}`);

  if (Number.isNaN(majorVersion) || majorVersion < MINIMUM_MAJOR_VERSION) {
    throw new Error(
      `Unsupported semantic-release version: ${version}. ` +
      `This action requires semantic-release v${MINIMUM_MAJOR_VERSION} or above. ` +
      `Update the 'semantic_version' input to v${MINIMUM_MAJOR_VERSION} or above, or remove it to use the latest version.`
    );
  }
};
