const router = require('express').Router();
const country = require('../data/country.json');
const MESSAGE = require('../constants/message');
const fetchFileData = require('../utils/fetchFileData');

const getAllCountry = (_, res) => {
  res.status(200).send(country);
};

const getCurrentCountryStatus = ({ params }, res) => {
  fetchFileData()
    .then(data => {
      const country = data.countries.filter(c => c.alpha3 === params.id.toUpperCase());
      res.status(200).send(country)
    })
    .catch(err => {
      console.log(err.message);
      res.status(500).send({ message: MESSAGE.SOURCE_FILE_INACCESSIBLE });
    });
};

router.get('/', getAllCountry);
router.get('/:id', getCurrentCountryStatus);

module.exports = router;
