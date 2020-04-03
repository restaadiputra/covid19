const router = require('express').Router();
const fetchFileData = require('../utils/fetchFileData');
const MESSAGE = require('../constants/message');

router.get('/:filename', ({ params }, res) => {
  fetchFileData(params.filename === undefined ? undefined : `${params.filename}`)
    .then(data => {
      res.status(200).send(data);
    })
    .catch(err => {
      console.log(err.message);
      res.status(404).send({ message: MESSAGE.SOURCE_FILE_INACCESSIBLE })
    });
});

module.exports = router;
