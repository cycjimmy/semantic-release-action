// stringToJson.js
// NOTE: The input string is evaluated as a JavaScript expression. This is
// required for backward compatibility with documented `branches` configs
// which use JS syntax (single-quoted strings, unquoted object keys), so it
// must only be fed with trusted input from the workflow file.
const strToJsonFunc = (str) => (new Function(`return ${str}`))();
const strToJson = (str) => {
  try {
    return strToJsonFunc(str);
  } catch (e) {
    return str;
  }
};

export default (str) => strToJson(str);