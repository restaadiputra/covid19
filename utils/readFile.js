const fs = require('fs');
const getFilePath = require('./getFilePath');

module.exports = cb => fs.readFile(getFilePath('data.json'), cb);
