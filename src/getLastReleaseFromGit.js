import * as core from '@actions/core';
import { promisify } from 'util';
import { execFile } from 'child_process';
import inputs from './inputs.json' with { type: 'json' };

const execFileAsync = promisify(execFile);

const VERSION_PLACEHOLDER = '${version}';

// Complete semantic versions (core releases and pre-releases) with an
// optional build metadata suffix
const SEMVER_REGEXP = /^(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)(?:-([0-9A-Za-z-.]+))?(?:\+[0-9A-Za-z-.]+)?$/;

// Used when the tag format is unknown (no `tag_format` input and possibly a
// custom format in the semantic-release config): extract a version-like
// suffix from tags such as `1.2.3`, `v1.2.3` or `release-1.2.3`
const GENERIC_TAG_REGEXP = /^.*?(?<![\d.])(\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?)$/;

const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Build a regexp extracting the version from tags rendered with `tagFormat`
 * (e.g. `v${version}` matches `v1.2.3` and extracts `1.2.3`).
 * @param {string} tagFormat
 * @returns {RegExp|null}
 */
const toTagRegexp = (tagFormat) => {
  const placeholderIndex = tagFormat.indexOf(VERSION_PLACEHOLDER);

  if (placeholderIndex === -1) {
    return null;
  }

  const prefix = escapeRegExp(tagFormat.slice(0, placeholderIndex));
  const suffix = escapeRegExp(tagFormat.slice(placeholderIndex + VERSION_PLACEHOLDER.length));

  return new RegExp(`^${prefix}(.+)${suffix}$`);
};

/**
 * Pick the release to report from tags sorted in descending version order:
 * the latest stable version, or the latest pre-release when no stable
 * version exists.
 * @param {string[]} tags
 * @param {RegExp} tagRegexp
 * @returns {{version: string, gitTag: string}|undefined}
 */
const pickVersion = (tags, tagRegexp) => {
  const releases = [];

  for (const tag of tags) {
    const [, version] = tag.match(tagRegexp) || [];
    const semverMatch = version && version.match(SEMVER_REGEXP);

    if (semverMatch) {
      releases.push({version, gitTag: tag, isPrerelease: Boolean(semverMatch[1])});
    }
  }

  return releases.find((release) => !release.isPrerelease) || releases[0];
};

const runGit = async (args) => {
  const {stdout} = await execFileAsync('git', args);
  return stdout.trim();
};

/**
 * Determine the last release from the local Git tags.
 *
 * This is a best-effort fallback for the reference returned by
 * semantic-release: when no new release is published, semantic-release
 * resolves to `false` and the last release has to be derived from the
 * repository tags instead.
 * @returns {Promise<{version: string, gitTag: string, gitHead: string}|undefined>}
 */
export default async () => {
  try {
    const tagFormat = core.getInput(inputs.tag_format);
    const tagRegexp = (tagFormat && toTagRegexp(tagFormat)) || GENERIC_TAG_REGEXP;
    const tags = (await runGit(['tag', '--merged', 'HEAD', '--sort=-v:refname']))
      .split('\n')
      .filter(Boolean);

    const release = pickVersion(tags, tagRegexp);

    if (!release) {
      core.debug('No last release could be determined from the Git tags.');
      return undefined;
    }

    let gitHead = '';
    try {
      gitHead = await runGit(['rev-list', '-n', '1', `refs/tags/${release.gitTag}`]);
    } catch (error) {
      core.debug(`Unable to resolve the commit of tag "${release.gitTag}": ${error.message}`);
    }

    return {version: release.version, gitTag: release.gitTag, gitHead};
  } catch (error) {
    core.debug(`Unable to determine the last release from the Git tags: ${error.message}`);
    return undefined;
  }
};
