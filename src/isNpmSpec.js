// isNpmSpec.js
// A plausible npm package/version spec: any characters except whitespace,
// quotes and other shell-like punctuation (kept as defense in depth even
// though the install commands run without a shell). A token starting with
// `-` is rejected so it can never be read as an npm option/flag.
const NPM_SPEC_PATTERN = /^[^\s'"`$;&(){}]+$/;

export default (spec) => !spec.startsWith('-') && NPM_SPEC_PATTERN.test(spec);
