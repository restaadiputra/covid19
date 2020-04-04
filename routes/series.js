const router = require('express').Router();
const fetchFileData = require('../utils/fetchFileData');
const moment = require('moment');
const MESSAGE = require('../constants/message');

const caseTypes = ['confirmed', 'deaths', 'recovered'];

const caseIndex = caseType => caseTypes.indexOf(caseType);

const findDateIndex = (accumulator, date) =>
  accumulator.findIndex(item => Object.keys(item).indexOf(date) !== -1);

const mappingData = (accumulator, data, caseType, countryID) => {
  data.forEach(c => {
    if (
      countryID === undefined ||
      countryID === '' ||
      countryID.toUpperCase() === c.alpha3
    ) {
      c.history.forEach((e, index) => {
        if (accumulator[index]) {
          if (accumulator[index][e[0]]) {
            if (accumulator[index][e[0]][caseType]) {
              accumulator[index][e[0]][caseType] += e[1];
            } else {
              accumulator[index][e[0]] = {
                ...accumulator[index][e[0]],
                [caseType]: e[1]
              };
            }
          } else {
            const indexOfDate = findDateIndex(accumulator, [e[0]]);
            if (indexOfDate === -1) {
              accumulator[accumulator.length] = {
                [e[0]]: {
                  [caseType]: e[1]
                }
              };
            } else {
              if (accumulator[indexOfDate][e[0]][caseType]) {
                accumulator[indexOfDate][e[0]][caseType] += e[1];
              } else {
                accumulator[indexOfDate][e[0]] = {
                  [caseType]: e[1]
                };
              }
            }
          }
        } else {
          accumulator[index] = {
            [e[0]]: {
              [caseType]: e[1]
            }
          };
        }
      });
    }
  });
};

const createHistorySummarize = (accumulator, data, caseType, countryID) => {
  if (caseType === 'all' || caseType == undefined || caseType === '') {
    data.forEach((cases, index) => {
      mappingData(accumulator, cases, caseTypes[index], countryID);
    });
  } else {
    mappingData(accumulator, data[caseIndex(caseType)], caseType, countryID);
  }
};

const addCurrentSummarize = (accumulator, data, caseType, countryID) => {
  const dateKeys = moment(data.dataLastFetch).format('M/D/YYYY');
  const lastIndex = accumulator.length;

  const isValid = caseType =>
    !!accumulator[accumulator.length - 1][dateKeys][caseType];

  const setValue = (caseType, value) => {
    if (accumulator[lastIndex] === undefined) {
      accumulator[lastIndex] = {
        [dateKeys]: {}
      };
    }

    if (isValid(caseType)) {
      accumulator[lastIndex][dateKeys][caseType] += value;
    } else {
      accumulator[lastIndex][dateKeys][caseType] = value;
    }
  };

  data.countries.forEach(c => {
    if (
      countryID === undefined ||
      countryID === '' ||
      countryID.toUpperCase() === c.alpha3
    ) {
      if (caseType === 'all' || caseType == undefined || caseType === '') {
        setValue('confirmed', c.confirmed);
        setValue('deaths', c.deaths);
        setValue('recovered', c.recovered);
      } else {
        setValue(caseType, c.confirmed);
      }
    }
  });
};

const prepareData = async (caseType = 'all', countryID) => {
  const [current, ...rest] = await Promise.all([
    fetchFileData(),
    fetchFileData('confirmed'),
    fetchFileData('deaths'),
    fetchFileData('recovered')
  ]);
  const result = [];
  createHistorySummarize(result, rest, caseType, countryID);
  addCurrentSummarize(result, current, caseType, countryID);
  return result;
};

const validateCaseType = (req, res, next) => {
  if (req.query.case && caseIndex(req.query.case) === -1) {
    res.status(400).send({ message: MESSAGE.CASE_TYPE_WRONG });
    next('router');
  }
  next();
};

const getAllData = (req, res) => {
  prepareData(req.query.case, req.query.alpha3)
    .then(data => {
      res.status(200).send(data);
    })
    .catch(err => {
      console.log(err);
      res.status(500).send({ message: MESSAGE.SOURCE_FILE_INACCESSIBLE });
    });
};

router.get('/', validateCaseType, getAllData);

module.exports = router;
