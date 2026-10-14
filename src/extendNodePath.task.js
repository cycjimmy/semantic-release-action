import path, {dirname} from 'path';
import { fileURLToPath } from 'url';
import Module from 'module';
import * as core from '@actions/core';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Append the action's own node_modules to NODE_PATH and refresh the module
 * search paths of the current process.
 *
 * semantic-release resolves a plugin from the directory of the config file
 * that declares it, falling back to cwd. When the `working_directory` input
 * points to a subdirectory and plugins are declared in a config file reached
 * through a relative `extends` (e.g. `extends: ['../../.releaserc.cjs']`),
 * those directories have no node_modules chain leading to the action's
 * installation, so packages pre-installed by this action (extra_plugins and
 * extends inputs) can't be found and semantic-release fails with
 * "Cannot find module ...".
 *
 * NODE_PATH entries are consulted by the CommonJS resolver only after every
 * node_modules directory on the lookup chain, so dependencies of the user's
 * project always keep precedence over the action's installation.
 *
 * Node captures NODE_PATH at startup, so Module.globalPaths must be refreshed
 * in-process through Module._initPaths(). When that internal API is missing,
 * this degrades silently to the default resolution behavior.
 *
 * @returns {Promise<void>}
 */
export default async () => {
  const actionNodeModules = path.resolve(__dirname, '..', 'node_modules');

  process.env.NODE_PATH = process.env.NODE_PATH
    ? [process.env.NODE_PATH, actionNodeModules].join(path.delimiter)
    : actionNodeModules;

  try {
    Module._initPaths();
  } catch (error) {
    core.warning(`Unable to refresh module search paths: ${error.message}`);
  }
};
