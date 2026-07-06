// stringToJson.js
const strToJsonFunc = (str) => (new Function(`return ${str}`))();
const strToJson = (str) => {
  try {
    return strToJsonFunc(str);
  } catch (e) {
    return str;
  }
};

export default (str) => strToJson(strToJson(str));