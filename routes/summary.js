const router = require('express').Router();
const fetchFileData = require('../utils/fetchFileData');
const MESSAGE = require('../constants/message');

router.get('/', (_, res) => {
  fetchFileData('arcgis')
    .then(data => {
      res.status(200).send(data);
    })
    .catch(err => {
      console.log(err.message);
      res.status(500).send({ message: MESSAGE.SOURCE_FILE_INACCESSIBLE });
    });
});

module.exports = router;
