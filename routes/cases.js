const router = require('express').Router();
const findLastKey = require('lodash/findLastKey');
const moment = require('moment');
const convertStringToNumber = require('../utils/convertStringToNumber');
const fetchData = require('../utils/fetchData');
const MESSAGE = require('../constants/message');

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

const mapping = (data, result, caseType, date) => {
  data[types[caseType].dataField].forEach(country => {
    const { history, ...rest } = country;
    const lastValue = convertStringToNumber(
      history[
        date === undefined
          ? findLastKey(history)
          : moment(date, 'M-D-YYYY').format('M/D/YY')
      ]
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

const prepareData = (caseType, data, date) => {
  const result = {
    lastUpdate: data.lastUpdate,
    date: moment(date, 'M-D-YYYY').format('MM-DD-YYYY'),
    [types[caseType].countField]: 0,
    detail: []
  };
  mapping(data, result, caseType, date);
  return result;
};

const getCurrentURL = req => `${req.protocol}://${req.headers.host}/api/cases`;

const getAvailableEndpoint = req => [
  `${getCurrentURL(req)}/confirmed`,
  `${getCurrentURL(req)}/death`,
  `${getCurrentURL(req)}/recovered`
];

const getData = (req, res) => {
  if (types[req.params.type] === undefined) {
    res.status(400).send({
      message: MESSAGE.CASE_TYPE_WRONG,
      availableEndpoint: getAvailableEndpoint(req)
    });
  } else if (
    req.params.date !== undefined &&
    !moment(req.params.date, 'M-D-YYYY').isValid()
  ) {
    res.status(400).send({
      message: MESSAGE.DATE_FORMAT_WRONG
    });
  } else {
    fetchData()
      .then(data => {
        res
          .status(200)
          .send(prepareData(req.params.type, data, req.params.date));
      })
      .catch(err => {
        console.log(err);
        res.status(500).send({
          message: MESSAGE.SOURCE_FILE_INACCESSIBLE
        });
      });
  }
};

router.get('/', (req, res) => {
  res.status(200).send({
    availableEndpoint: getAvailableEndpoint(req)
  });
});
router.get('/:type', getData);
router.get('/:type/:date', getData);

module.exports = router;
