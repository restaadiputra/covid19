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
    const { history, ...rest } = country;
    const lastValue = convertStringToNumber(
      Object.values(history[history.length - 1])[0]
    );

    result[types[caseType].countField] += lastValue;

    if (lastValue !== 0) {
      result.detail.push({
        ...rest,
        [types[caseType].detailCase]: lastValue
      });
    }
  });
};

const prepareData = (caseType, data) => {
  const result = {
    lastUpdate: data.lastUpdate,
    [types[caseType].countField]: 0,
    detail: []
  };
  try {
    mapping(data, result, caseType);
  } catch (error) {
    console.log(error);
  }

  result.detail = Object.keys(result.detail).map(key => result.detail[key]);
  return result;
};

const getCurrentURL = req =>
  `${req.protocol}://${req.headers.host}/api/cases`;

router.get('/', (req, res) => {
  res.status(200).send({
    availableEndPoint: [
      `${getCurrentURL(req)}/confirmed`,
      `${getCurrentURL(req)}/death`,
      `${getCurrentURL(req)}/recovered`
    ]
  });
});

router.get('/:type', (req, res, next) => {
  if (types[req.params.type] === undefined) {
    res.status(404).send({
      message: `Case-type is wrong. Choose between 'confirm', 'death', and 'recovered'. All in lowercase.`,
      availableEndPoint: [
        `${getCurrentURL(req)}/confirmed`,
        `${getCurrentURL(req)}/death`,
        `${getCurrentURL(req)}/recovered`
      ]
    });
  } else {
    fetchData()
      .then(data => {
        res.status(200).send(prepareData(req.params.type, data));
      })
      .catch(err => {
        console.log(err);
        next();
      });
  }
});

module.exports = router;
