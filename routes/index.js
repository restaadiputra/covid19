const express = require('express');
const router = express.Router();
const convertStringToNumber = require('../utils/convertStringToNumber');
const readFile = require('../utils/readFile');

const mapping = (data, result, dataField, resultField, caseType) => {
  data[dataField].forEach(country => {
    const { history, ...rest } = country;

    result[resultField] += convertStringToNumber(
      Object.values(history[history.length - 1])[0]
    );

    result.detail[rest.country+rest.state] = {
      ...rest,
      'confirmedCase': 0,
      'deathCase': 0,
      'recoveredCase': 0,
      ...result.detail[rest.country+rest.state],
      [caseType]: convertStringToNumber(
        Object.values(history[history.length - 1])[0]
      )
    };
  });
};

const prepareData = data => {
  const result = {
    'totalConfirmedCase': 0,
    'totalDeathCase': 0,
    'totalRecoveredCase': 0,
    'detail': {}
  };
  try {
    result['lastUpdate'] = data['lastUpdate'];
    mapping(data, result, 'historyConfirmedCases', 'totalConfirmedCase', 'confirmedCase');
    mapping(data, result, 'historyDeathCases', 'totalDeathCase', 'deathCase');
    mapping(data, result, 'historyRecoveredCases', 'totalRecoveredCase', 'recoveredCase');
  } catch (error) {
    console.log(error);
  }

  result['detail'] = Object.keys(result['detail']).map(key => result['detail'][key]);
  return result;
};

router.get('/', (req, res, next) => {
  readFile((err, data) => {
    if (err) {
      next();
    } else {
      res.status(200).send(prepareData(JSON.parse(data)));
    }
  });
});

router.get('/source', (req, res, next) => {
  readFile((err, data) => {
    if (err) {
      next();
    } else {
      res.status(200).send(JSON.parse(data));
    }
  });
});

module.exports = router;
