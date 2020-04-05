const axios = require('axios');
const get = require('lodash/get');
const cjson = require('compressed-json');
const URL = require('../constants/url');
const readFile = require('./fileIO').readFileDecompress;

const fetchFileData = async (filename = 'arcgis') => {
  if (process.env.USE_GITHUB) {
    return axios
      .get(URL.GITHUB_REPO_URL + filename)
      .then(result => cjson.decompress(get(result, 'data', {})));
  }
  else {
    return readFile(filename)
  }
};

module.exports = fetchFileData;
