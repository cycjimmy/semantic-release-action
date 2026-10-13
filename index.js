import runNpm from './src/runNpm.js';
import path, {dirname} from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const run = async () => {
  // Install Dependencies
  {
    // Prefer running npm through the current Node executable so package
    // manager shims (e.g. Corepack) can't intercept this install in normal
    // environments. If the current Node distribution does not bundle
    // npm-cli.js, runNpm will fall back to the `npm` executable from PATH.
    const {stdout, stderr} = await runNpm(['ci', '--only=prod', '--loglevel', 'error'], {
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
