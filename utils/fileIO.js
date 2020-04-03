const fs = require('fs');
const appRoot = require('app-root-path');
const cjson = require('compressed-json');

const getFilePath = filename => `${appRoot}/data/${filename}.json`;

const readFile = filename =>
  fs.promises
    .readFile(getFilePath(filename), { encoding: 'utf8' })
    .then(data => cjson.decompress(JSON.parse(data)));

const writeFile = (filename, data) =>
  fs.promises.writeFile(
    getFilePath(filename),
    JSON.stringify(cjson.compress(data)),
    { encoding: 'utf8' }
  );

module.exports = {
  readFile,
  writeFile,
  getFilePath
};
