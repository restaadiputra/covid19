const path = require('path');

module.exports = filename =>
  path.resolve(__dirname, '..') + '/data/' + filename;
