const axios = require('axios').default;
const csv = require('csvtojson');
const get = require('lodash/get');
const URL = require('../constants/url');
const formatCountryString = require('../utils/formatCountryString');
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

const sanitizeData = data =>
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
      country: formatCountryString(country).name,
      alpha2: formatCountryString(country).alpha2,
      alpha3: formatCountryString(country).alpha3,
      region: formatCountryString(country).region,
      subRegion: formatCountryString(country).subRegion,
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
  const history = sanitizeData(parsedJSON);
  const fileData = {
    dataLastFetch: new Date().toISOString(),
    type: `history of ${caseType} cases`,
    detail: history
  };

  fileIO.writeFile(types[caseType].filename, fileData);
};

const getConfirmedCases = () => prepareAndWriteData('confirmed');
const getDeathsCases    = () => prepareAndWriteData('deaths');
const getRecoveredCases = () => prepareAndWriteData('recovered');

module.exports = {
  getConfirmedCases,
  getDeathsCases,
  getRecoveredCases
};
