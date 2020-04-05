const router = require('express').Router();
const moment = require('moment');
const fetchFileData = require('../utils/fetchFileData');
const convertStringToNumber = require('../utils/convertStringToNumber');
const MESSAGE = require('../constants/message');

const isCaseTypeValid = caseType =>
  ['confirmed', 'deaths', 'recovered'].indexOf(caseType.toLowerCase());

const isDateSameOrAfter = date => 
  moment(date, 'MM-DD-YY').isSameOrAfter(moment(new Date(), moment.ISO_8601),'date');

const isDateAfter = date => 
  moment(date, 'MM-DD-YY').isAfter(moment(new Date(), moment.ISO_8601),'date');

const getCurrentURL = req => `${req.protocol}://${req.headers.host}/api/cases`;

const getTotalField = caseType =>
  caseType === ''
    ? 'total'
    : `total${caseType.charAt(0).toUpperCase() + caseType.slice(1)}`;

const getValueOfDate = (list = [], date) => {
  const dateArray = list.find(e => e[0] === moment(date, 'M-D-YYYY').format('M/D/YY'))
  if (dateArray === undefined) {
    return 0;
  } else {
    convertStringToNumber(dateArray[1]);
  }
}

const getAllEndpoint = req => ({
  availableEndpoint: [
    `${getCurrentURL(req)}/confirmed`,
    `${getCurrentURL(req)}/deaths`,
    `${getCurrentURL(req)}/recovered`
  ]
});

const prepareDailyData = async (caseType, date = new Date()) => {
  const dataFile = await fetchFileData(caseType);
  const result = {
    date: moment(date, 'M-D-YYYY').format('MM-DD-YYYY'),
    cases: `${caseType} cases`,
    [getTotalField(caseType)]: 0,
    country: []
  };

  dataFile.forEach(country => {
    const { history, ...rest } = country;
    const dateValue = getValueOfDate(history, date);

    if (dateValue > 0) {
      result[getTotalField(caseType)] += dateValue;
      result.country.push({
        ...rest,
        [caseType]: dateValue
      });
    }
  });

  return result;
};

const prepareCurrentDailyData = async (caseType, date = new Date()) => {
  const dataFile = await fetchFileData('arcgis');
  const result = {
    date: isDateAfter(date) 
      ? moment(date, 'M-D-YYYY').format('MM-DD-YYYY')
      : moment(dataFile.dataLastFetch).format('MM-DD-YYYY'),
    cases: `${caseType.toLowerCase()} cases`,
    [getTotalField(caseType)]: dataFile[getTotalField(caseType)],
    country: []
  };

  result.country = dataFile.countries.map(country => {
    return {
      state: country.state,
      country: country.country,
      alpha2: country.alpha2,
      alpha3: country.alpha3,
      region: country.region,
      subRegion: country.subRegion,
      lat: country.lat,
      long: country.long,
      [caseType]: country[caseType]
    };
  });

  return result;
};

const validateCaseAndDate = (req, res, next) => {
  if (isCaseTypeValid(req.params.type) == -1) {
    res.status(400).send({
      message: MESSAGE.CASE_TYPE_WRONG,
      ...getAllEndpoint(req)
    });
  } else if (
    req.params.date !== undefined &&
    !moment(req.params.date, 'M-D-YYYY').isValid()
  ) {
    res.status(400).send({
      message: MESSAGE.DATE_FORMAT_WRONG
    });
  } else {
    next();
  }
};

const getDataCaseByDate = (req, res, next) => {
  if (isDateSameOrAfter(req.params.date)) {
    next();
    return;
  }

  prepareDailyData(req.params.type, req.params.date)
    .then(data => {
      res.status(200).send(data);
    })
    .catch(err => {
      console.log(err.message);
      res.status(500).send({ message: 'test' });
    });
};

const getCurrentDataCase = ({ params }, res) => {
  prepareCurrentDailyData(params.type, params.date)
    .then(data => {
      res.status(200).send(data);
    })
    .catch(err => {
      console.log(err.message);
      res.status(500).send({ message: 'test' });
    });
};

const getAvailableEndpoint = (req, res) => {
  res.status(200).send(getAllEndpoint(req));
};

router.get('/', getAvailableEndpoint);
router.get('/:type', validateCaseAndDate, getCurrentDataCase);
router.get('/:type/:date', validateCaseAndDate, getDataCaseByDate, getCurrentDataCase);

module.exports = router;
