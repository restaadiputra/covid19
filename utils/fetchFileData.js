const axios = require('axios');
const get = require('lodash/get');
const URL = require('../constants/url');
const fileIO = require('./fileIO');

const fetchFileData = async (filename = 'data') => {
  if (process.env.USE_GITHUB) {
    return axios
      .get(URL.GITHUB_REPO_URL + filename)
      .then(result => get(result, 'data', {}));
  }
  else {
    return fileIO.readFile(filename)
      .then(data => data);
  }
};

module.exports = fetchFileData;
