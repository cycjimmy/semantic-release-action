import * as io from '@actions/io';

/**
 * Clean up `.npmrc` file in the repo after releasing
 * @returns {Promise<never>}
 */
export default async () => {
  await io.rmRF('.npmrc');
};
