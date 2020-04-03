const axios = require('axios').default;
const csv = require('csvtojson');
const get = require('lodash/get');
const URL = require('../constants/url');
const getCountryFormat = require('../utils/getCountryFormat');
const fileIO = require('../utils/fileIO');

const types = {
  confirmed: {
    url: URL.CONFIRM_GLOBAL,
    filename: 'confirmed.json'
  },
  deaths: {
    url: URL.DEATHS_GLOBAL,
    filename: 'deaths.json'
  },
  recovered: {
    url: URL.RECOVERED_GLOBAL,
    filename: 'recovered.json'
  }
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
    const history = rest;

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
  const csvFile = await axios.get(types[caseType].url).catch(err => {
    console.log(err);
    return null;
  });

  const parsedJSON = await csv().fromString(get(csvFile, 'data', ''));
  const history = mappingKeys(parsedJSON);
  const fileData = {
    dataLastFetch: new Date().toISOString(),
    type: `history of ${caseType} cases`,
    detail: history
  };

  fileIO.writeFile(types[caseType].filename, fileData);
};

const syncGithubConfirmedData = () => prepareAndWriteData('confirmed');
const syncGithubDeathsData    = () => prepareAndWriteData('deaths');
const syncGithubRecoveredData = () => prepareAndWriteData('recovered');

module.exports = {
  syncGithubConfirmedData,
  syncGithubDeathsData,
  syncGithubRecoveredData
};
