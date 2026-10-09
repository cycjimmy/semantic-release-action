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

run().catch((error) => {
  console.error(error instanceof Error ? error.stack : error);

  // Exit with a non-zero code so the workflow step is marked as failed
  process.exitCode = 1;
});
