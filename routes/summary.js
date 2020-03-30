const router = require('express').Router();
const fetchData = require('../utils/fetchData');
const URL = require('../constants/url');
const MESSAGE = require('../constants/message');

router.get('/', (_, res) => {
  fetchData(process.env.USE_GITHUB ? URL.GITHUB_RAW_SUMMARY : 'summary.json')
    .then(data => {
      res.status(200).send(data);
    })
    .catch(err => {
      console.log(err);
      res.status(500).send({ message: MESSAGE.SOURCE_FILE_INACCESSIBLE });
    });
});

module.exports = router;
