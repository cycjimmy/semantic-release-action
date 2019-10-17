const util = require('util');
module.exports = util.promisify(require('child_process').exec);
