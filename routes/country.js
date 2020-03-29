const router = require('express').Router();
const fs = require('fs');
const find = require('lodash/find');
const getFilePath = require('../utils/getFilePath');

router.get('/', (_, res) => {
  fs.readFile(getFilePath('country.json'), (err, data) => {
    if (err) {
      res.status(500).send({
        message: `Data is missing or there is something wrong. Please contact admin.`
      });
    } else {
      res.status(200).send(JSON.parse(data));
    }
  });
});

module.exports = router;
