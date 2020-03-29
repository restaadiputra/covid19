const axios = require('axios');
const fs = require('fs');
const get = require('lodash/get');
const URL = require('../constants/url');
const getFilePath = require('../utils/getFilePath');

// You can choose to use local 'data.json' as your source or
// in my case, I want to use the 'data.json' that already in
// my GitHub as that data will automatically updated periodically.

const fetchData = async filename => {
  // use GitHub data if I set env of 'USE_GITHUB' to true
  if (process.env.USE_GITHUB) {
    return axios
      .get(filename || URL.GITHUB_RAW_DATA)
      .then(result => get(result, 'data', {}));
  }
  // or use local 'data.json'
  else {
    return fs.promises
      .readFile(getFilePath(filename || 'data.json'), { encoding: 'utf8' })
      .then(data => JSON.parse(data));
  }
};

module.exports = fetchData;
