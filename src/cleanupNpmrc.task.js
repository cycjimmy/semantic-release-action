const io = require('@actions/io');

/**
 * Clean up `.npmrc` file in the repo after releasing
 * @returns {Promise<never>}
 */
module.exports = async () => {
  await io.rmRF('.npmrc');
};
