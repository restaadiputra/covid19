const router = require('express').Router();
const MESSAGE = require('../constants/message');
const fetchFileData = require('../utils/fetchFileData');
const readFile = require('../utils/fileIO').readFile;

const getAllCountry = (_, res) => {
  readFile('country')
    .then(data => {
      res.status(200).send(data);
    })
    .catch(() => {
      res.status(500).send({ message: MESSAGE.SOURCE_FILE_INACCESSIBLE });
    })
};

const getCurrentCountryStatus = ({ params }, res) => {
  fetchFileData()
    .then(data => {
      const country = data.countries.filter(c => c.alpha3 === params.id.toUpperCase());
      res.status(200).send(country)
    })
    .catch(() => {
      res.status(500).send({ message: MESSAGE.SOURCE_FILE_INACCESSIBLE });
    });
};

router.get('/', getAllCountry);
router.get('/:id', getCurrentCountryStatus);

module.exports = router;
