import assert from 'node:assert/strict';
import {test} from 'node:test';
import {handleExtends} from '../src/handleOptions.js';

test('extends uses the same whitespace separators as pre-installation', () => {
  const previous = process.env.INPUT_EXTENDS;
  try {
    for (const separator of [' ', '\t', '\n', '\r\n', '\n\n']) {
      process.env.INPUT_EXTENDS = `release-config-one@1${separator}@company/release-config@^2`;
      assert.deepEqual(handleExtends(), {
        extends: ['release-config-one', '@company/release-config']
      });
    }
  } finally {
    if (previous === undefined) {
      delete process.env.INPUT_EXTENDS;
    } else {
      process.env.INPUT_EXTENDS = previous;
    }
  }
});

test('extends preserves a single unversioned config and omits an unset input', () => {
  const previous = process.env.INPUT_EXTENDS;
  try {
    process.env.INPUT_EXTENDS = '@company/release-config';
    assert.deepEqual(handleExtends(), {extends: ['@company/release-config']});
    delete process.env.INPUT_EXTENDS;
    assert.deepEqual(handleExtends(), {});
  } finally {
    if (previous === undefined) {
      delete process.env.INPUT_EXTENDS;
    } else {
      process.env.INPUT_EXTENDS = previous;
    }
  }
});
