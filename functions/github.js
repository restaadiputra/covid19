const axios = require('axios').default;
const csv = require('csvtojson');
const get = require('lodash/get');
const URL = require('../constants/url');
const getCountryFormat = require('../utils/getCountryFormat');
const writeFile = require('../utils/fileIO').writeFileCompress;

const types = {
  confirmed: URL.CONFIRM_GLOBAL,
  deaths: URL.DEATHS_GLOBAL,
  recovered: URL.RECOVERED_GLOBAL,
};

const mappingKeys = data =>
  data.map(item => {
    const {
      'Country/Region': country,
      'Province/State': state,
      Lat: lat,
      Long: long,
      ...rest
    } = item;
    const history = Object.keys(rest).map(e => ([e, parseInt(rest[e])]));

    return {
      state,
      country: getCountryFormat(country).name,
      alpha2: getCountryFormat(country).alpha2,
      alpha3: getCountryFormat(country).alpha3,
      region: getCountryFormat(country).region,
      subRegion: getCountryFormat(country).subRegion,
      lat,
      long,
      history
    };
  });

const prepareAndWriteData = async caseType => {
  const csvFile = await axios.get(types[caseType]).catch(err => {
    console.log(err);
    return null;
  });

  const parsedJSON = await csv().fromString(get(csvFile, 'data', ''));
  const history = mappingKeys(parsedJSON);
  writeFile(caseType, history);
};

const syncGithubConfirmedData = () => prepareAndWriteData('confirmed');
const syncGithubDeathsData    = () => prepareAndWriteData('deaths');
const syncGithubRecoveredData = () => prepareAndWriteData('recovered');

module.exports = {
  syncGithubConfirmedData,
  syncGithubDeathsData,
  syncGithubRecoveredData
};
