import exec from './src/_exec.js';
import path, {dirname} from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const run = async () => {
  // Install Dependencies
  {
    const {stdout, stderr} = await exec('npm --loglevel error ci --only=prod', {
      cwd: path.resolve(__dirname)
    });
    console.log(stdout);
    if (stderr) {
      return Promise.reject(stderr);
    }
  }

  const mod = await import('./src/index.js');
  await mod.default();
};

run().catch(console.error);
