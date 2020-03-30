const fs = require('fs');
const findLastKey = require('lodash/findLastKey');
const cases = require('./getDataCases');
const getFilePath = require('../utils/getFilePath');
const convertStringToNumber = require('../utils/convertStringToNumber');
const formatCountryString = require('../utils/formatCountryString');
const FILENAME = require('../constants/filename');

const types = {
  confirmed: {
    dataField: 'historyConfirmedCases',
    countField: 'totalConfirmedCases',
    detailCase: 'confirmed'
  },
  death: {
    dataField: 'historyDeathCases',
    countField: 'totalDeathCases',
    detailCase: 'death'
  },
  recovered: {
    dataField: 'historyRecoveredCases',
    countField: 'totalRecoveredCases',
    detailCase: 'recovered'
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
    // const history = Object.keys(rest).map(key => ({ [key]: rest[key] }));
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

const mapping = (data, result, caseType) => {
  data[types[caseType].dataField].forEach(country => {
    const { history, state, ...rest } = country;
    const lastValue = convertStringToNumber(history[findLastKey(history)]);

    result[types[caseType].countField] += lastValue;

    if (result.detail[rest.country]) {
      result.detail[rest.country] = {
        ...result.detail[rest.country],
        [types[caseType].detailCase]:
          result.detail[rest.country][types[caseType].detailCase] + lastValue
      };
    } else {
      result.detail[rest.country] = {
        ...rest,
        confirmed: 0,
        death: 0,
        recovered: 0,
        [types[caseType].detailCase]: lastValue
      };
    }
  });
};

const prepareData = async () => {
  const data = {};
  try {
    const confirmData   = await cases.getConfirmCases();
    const deathData     = await cases.getDeathCases();
    const recoveredData = await cases.getRecoveredCases();

    data['lastUpdate'] = new Date().toISOString();
    data['historyConfirmedCases'] = sanitizeData(confirmData);
    data['historyDeathCases']     = sanitizeData(deathData);
    data['historyRecoveredCases'] = sanitizeData(recoveredData);
  } catch (error) {
    console.log(error);
  }
  return data;
};

const prepareLatestSummaryData = data => {
  const result = {
    lastUpdate: data.lastUpdate,
    totalConfirmedCases: 0,
    totalDeathCases: 0,
    totalRecoveredCases: 0,
    detail: {}
  };
  try {
    mapping(data, result, 'confirmed');
    mapping(data, result, 'death');
    mapping(data, result, 'recovered');
  } catch (error) {
    console.log(error);
  }

  result.detail = Object.keys(result.detail).map(key => result.detail[key]);
  return result;
};

const syncData = async () => {
  const data = await prepareData();
  fs.writeFileSync(getFilePath(FILENAME.MAIN_DATA), JSON.stringify(data));
  fs.writeFileSync(
    getFilePath(FILENAME.SUMMARY_DATA),
    JSON.stringify(prepareLatestSummaryData(data))
  );
};

syncData();
