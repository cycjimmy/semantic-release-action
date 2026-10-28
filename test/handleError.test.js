import assert from 'node:assert/strict';
import {test} from 'node:test';
import handleError from '../src/handleError.js';

// handleError reports through @actions/core, which writes workflow commands to stdout
const captureWorkflowCommands = (callback) => {
  const chunks = [];
  const originalWrite = process.stdout.write;
  const originalExitCode = process.exitCode;
  process.stdout.write = (chunk) => chunks.push(String(chunk)) > 0;
  try {
    callback();
  } finally {
    process.stdout.write = originalWrite;
    process.exitCode = originalExitCode;
  }
  return chunks.join('');
};

const semanticReleaseError = (code, message) =>
  Object.assign(new Error(message), {name: 'SemanticReleaseError', code});

test('handleError hints skip_npm_plugin when ENOPKG is nested in aggregated errors', () => {
  const output = captureWorkflowCommands(() =>
    handleError(new AggregateError([
      new AggregateError([semanticReleaseError('ENOPKG', 'Missing `package.json` file.')])
    ]))
  );

  assert.match(output, /::warning::.*skip_npm_plugin/s);
  assert.match(output, /::error::/);
});

test('handleError reports an unrelated error without hints', () => {
  const output = captureWorkflowCommands(() => handleError(new Error('boom')));

  assert.doesNotMatch(output, /::warning::/);
  assert.match(output, /::error::.*boom/s);
});
