import { promisify } from 'util';
import { exec } from 'child_process';

export default promisify(exec);
