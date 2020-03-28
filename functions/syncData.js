const fs = require('fs');
const {
  getConfirmCases,
  getDeathCases,
  getRecoveredCases
} = require('./getDataCases');
const getFilePath = require('../utils/getFilePath');
const formatCountryString = require('../utils/formatCountryString');

const sanitizeData = data =>
  data.map(item => {
    const {
      'Country/Region': country,
      'Province/State': state,
      Lat: lat,
      Long: long,
      ...rest
    } = item;
    const history = Object.keys(rest).map(key => ({ [key]: rest[key] }));

    return {
      country: formatCountryString(country).name,
      alpha2: formatCountryString(country).alpha2,
      alpha3: formatCountryString(country).alpha3,
      region: formatCountryString(country).region,
      subRegion: formatCountryString(country).subRegion,
      state,
      lat,
      long,
      history
    };
  });

const prepareData = async () => {
  const data = {};
  try {
    const confirmData = await getConfirmCases();
    const deathData = await getDeathCases();
    const recoveredData = await getRecoveredCases();

    data['lastUpdate'] = new Date().toISOString();
    data['historyConfirmedCases'] = sanitizeData(confirmData);
    data['historyDeathCases'] = sanitizeData(deathData);
    data['historyRecoveredCases'] = sanitizeData(recoveredData);
  } catch (error) {
    console.log(error);
  }
  return data;
};

const syncData = async () => {
  fs.writeFileSync(
    getFilePath('data.json'),
    JSON.stringify(await prepareData())
  );
};

syncData();
