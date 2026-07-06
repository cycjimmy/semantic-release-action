import * as core from '@actions/core';
import exec from './_exec.js';
import inputs from './inputs.json' with { type: 'json' };;
import path, {dirname} from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Install Specifying Version semantic-release
 * @returns {Promise<void>}
 */
export default async () => {
  const semantic_version = core.getInput(inputs.semantic_version);
  const versionSuffix = semantic_version
    ? `@${semantic_version}`
    : '';

  const {stdout, stderr} = await exec(`npm install semantic-release${versionSuffix} --no-audit --silent`, {
    cwd: path.resolve(__dirname, '..')
  });
  core.debug(stdout);
  core.error(stderr);
};
