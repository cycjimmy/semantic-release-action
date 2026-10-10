import * as core from '@actions/core';

const EGITNOPERMISSION_HINT =
  `Push permission check failed (EGITNOPERMISSION). If you use the default GITHUB_TOKEN, ` +
  `grant write access to the job, e.g. "permissions: contents: write". ` +
  `This is also required in dry-run mode: semantic-release verifies push permission with "git push --dry-run". ` +
  `See https://github.com/cycjimmy/semantic-release-action#dry_run`;

/**
 * Check whether an error, or any aggregated sub-error, has the given code.
 * @param {Error|String} error
 * @param {String} code
 * @returns {Boolean}
 */
const hasErrorCode = (error, code) =>
  error?.code === code ||
  (Array.isArray(error?.errors) && error.errors.some((subError) => hasErrorCode(subError, code)));

/**
 * Report a failed release to GitHub Actions, adding extra hints for known semantic-release error codes.
 * @param {Error|String} error
 * @returns {void}
 */
const handleError = (error) => {
  if (hasErrorCode(error, 'EGITNOPERMISSION')) {
    core.warning(EGITNOPERMISSION_HINT);
  }

  core.setFailed(error);
};

export default handleError;
