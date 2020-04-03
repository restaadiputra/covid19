const router = require('express').Router();
const fetchData = require('../utils/fetchData');
const fileIO = require('../utils/fileIO');
const MESSAGE = require('../constants/message');

router.get('/:filename', ({ params }, res) => {
  fetchData(params.filename === undefined ? undefined : `${params.filename}.json`)
    .then(data => {
      res.status(200).send(data);
    })
    .catch(err => {
      console.log(err.message);
      res.status(404).send({ message: MESSAGE.SOURCE_FILE_INACCESSIBLE })
    });
});

module.exports = router;
