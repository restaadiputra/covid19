const router = require('express').Router();
const fetchData = require('../utils/fetchData');

router.get('/', (_, res) => {
  fetchData('summary.json')
    .then(data => { res.status(200).send(data); })
    .catch(err => {
      console.log(err);
      res.status(400).send({ message: 'Main data file cannot be fetched. Please contact admin or wait for few minutes.' })
    });
});

module.exports = router;
