const router = require('express').Router();
const convertStringToNumber = require('../utils/convertStringToNumber');
const readFile = require('../utils/readFile')

const mapping = (data, result, dataField, resultField, caseType) => {
  data[dataField].forEach(country => {
    const { history, state, ...rest } = country;

    result[resultField] += convertStringToNumber(
      Object.values(history[history.length - 1])[0]
    );

    if (result.detail[rest.country]) {
      result.detail[rest.country] = {
        ...result.detail[rest.country],
        [caseType]: result.detail[rest.country][caseType] + convertStringToNumber(
          Object.values(history[history.length - 1])[0]
        )
      }
    } else {
      result.detail[rest.country] = {
        ...rest,
        confirmedCase: 0,
        deathCase: 0,
        recoveredCase: 0,
        [caseType]: convertStringToNumber(
          Object.values(history[history.length - 1])[0]
        )
      }
    }
  });
};

const prepareData = data => {
  const result = {
    totalConfirmedCase: 0,
    totalDeathCase: 0,
    totalRecoveredCase: 0,
    detail: {}
  };
  try {
    result['lastUpdate'] = data['lastUpdate'];
    mapping(data, result, 'historyConfirmedCases', 'totalConfirmedCase', 'confirmedCase');
    mapping(data, result, 'historyDeathCases', 'totalDeathCase', 'deathCase');
    mapping(data, result, 'historyRecoveredCases', 'totalRecoveredCase', 'recoveredCase');
  } catch (error) {
    console.log(error);
  }

  result['detail'] = Object.keys(result['detail']).map(
    key => result['detail'][key]
  );
  return result;
};

router.get('/', (_, res, next) => {
  readFile((err, data) => {
    if (err) {
      next();
    } else {
      res.status(200).send(prepareData(JSON.parse(data)));
    }
  });
});

module.exports = router;
