const router = require('express').Router();
const fetchData = require('../utils/fetchData');

router.get('/', (_, res, next) => {
  fetchData()
    .then(data => {
      res.status(200).send(JSON.parse(data));
    })
    .catch(err => {
      console.log(err)
      next();
    });
});

module.exports = router;
