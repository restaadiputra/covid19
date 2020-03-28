const router = require('express').Router();
const readFile = require('../utils/readFile');

router.get('/', (_, res, next) => {
  readFile((err, data) => {
    if (err) {
      next();
    } else {
      res.status(200).send(JSON.parse(data));
    }
  });
});

module.exports = router;
