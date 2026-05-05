import util from 'util';
module.exports = util.promisify(require('child_process').exec);
