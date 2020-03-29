const router = require('express').Router();
const convertStringToNumber = require('../utils/convertStringToNumber');
const fetchData = require('../utils/fetchData');

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

const mapping = (data, result, caseType) => {
  data[types[caseType].dataField].forEach(country => {
    const { history, state, ...rest } = country;
    const lastValue = convertStringToNumber(
      Object.values(history[history.length - 1])[0]
    );

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
        confirmedCases: 0,
        deathCases: 0,
        recoveredCases: 0,
        [types[caseType].detailCase]: lastValue
      };
    }
  });
};

const prepareData = data => {
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

router.get('/', (_, res, next) => {
  fetchData()
    .then(data => {
      res.status(200).send(prepareData(data));
    })
    .catch(err => {
      console.log(err);
      next();
    });
});

module.exports = router;
