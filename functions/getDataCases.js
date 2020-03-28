const axios = require('axios').default;
const csv = require('csvtojson');
const get = require('lodash/get');
const URL = require('../constants/url');

const getCases = async url => {
  const csvFile = await axios.get(url).catch(error => {
    console.log(error);
    return null;
  });

  const parsedJSON = await csv().fromString(get(csvFile, 'data', ''));
  return parsedJSON;
};

const getConfirmCases = async () => await getCases(URL.CONFIRM_GLOBAL);
const getDeathCases = async () => await getCases(URL.DEATH_GLOBAL);
const getRecoveredCases = async () => await getCases(URL.RECOVERED_GLOBAL);

module.exports = {
  getConfirmCases,
  getDeathCases,
  getRecoveredCases
};
