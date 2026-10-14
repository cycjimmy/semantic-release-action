module.exports = {
  plugins: [
    ['@semantic-release/exec', {
      verifyConditionsCmd: 'echo exec plugin loaded from extended config'
    }]
  ]
};
