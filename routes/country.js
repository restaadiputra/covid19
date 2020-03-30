const router = require('express').Router();
const fs = require('fs');
const findLastKey = require('lodash/findLastKey');
const moment = require('moment');
const convertStringToNumber = require('../utils/convertStringToNumber');
const getFilePath = require('../utils/getFilePath');
const MESSAGE = require('../constants/message');
const fetchData = require('../utils/fetchData');
const country = require('../data/country.json');

const types = {
  confirmed: {
    dataField: 'historyConfirmedCases',
    countField: 'totalConfirmedCases'
  },
  death: {
    dataField: 'historyDeathCases',
    countField: 'totalDeathCases'
  },
  recovered: {
    dataField: 'historyRecoveredCases',
    countField: 'totalRecoveredCases'
  }
};

const getCountryData = alpha3 =>
  country.find(country => country.alpha3 === alpha3.toUpperCase());

const getAllCountry = (_, res) => {
  fs.readFile(getFilePath('country.json'), (err, data) => {
    if (err) {
      res.status(500).send({
        message: MESSAGE.SOURCE_FILE_INACCESSIBLE
      });
    } else {
      res.status(200).send(JSON.parse(data));
    }
  });
};

const mapping = (data, result, caseType, countryID, date) => {
  data[types[caseType].dataField].forEach(country => {
    const { history } = country;
    const lastValue = convertStringToNumber(
      history[
        date === undefined
          ? findLastKey(history)
          : moment(date, 'M-D-YYYY').format('M/D/YY')
      ]
    );
    if (result.effectiveDate === '') {
      result.effectiveDate = moment(findLastKey(history), 'M/D/YY').format(
        'MM-DD-YYYY'
      );
    }
    if (country.alpha3 === countryID) {
      result[types[caseType].countField] =
        (result[types[caseType].countField] || 0) + lastValue;
    }
  });
};

const prepareData = (data, countryID, date) => {
  const result = {
    lastUpdate: data.lastUpdate,
    dataType: 'accumulative',
    effectiveDate:
      date === undefined ? '' : moment(date, 'M-D-YYYY').format('MM-DD-YYYY'),
    ...getCountryData(countryID.toUpperCase()),
    totalConfirmedCases: 0,
    totalDeathCases: 0,
    totalRecoveredCases: 0
  };
  Object.keys(types).forEach(caseType => {
    mapping(data, result, caseType, countryID.toUpperCase(), date);
  });
  return result;
};

const getData = (req, res) => {
  if (getCountryData(req.params.id) === undefined) {
    res.status(404).send({
      message: MESSAGE.COUNTRY_NOT_FOUND
    })
  }
  if (
    req.params.date !== undefined &&
    !moment(req.params.date, 'M-D-YYYY').isValid()
  ) {
    res.status(400).send({
      message: MESSAGE.DATE_FORMAT_WRONG
    });
  } else {
    fetchData()
      .then(data => {
        res.status(200).send(prepareData(data, req.params.id, req.params.date));
      })
      .catch(err => {
        console.log(err);
        res.status(500).send({
          message: MESSAGE.SOURCE_FILE_INACCESSIBLE
        });
      });
  }
};

router.get('/', getAllCountry);
router.get('/:id', getData);
router.get('/:id/:date', getData);

module.exports = router;
