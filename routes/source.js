const router = require('express').Router();
const fs = require('fs');
const path = require('path');
const fetchFileData = require('../utils/fetchFileData');
const MESSAGE = require('../constants/message');

const getCurrentURL = req => `${req.protocol}://${req.headers.host}/api/source`;

router.get('/', (req, res) => {
  fs.readdir(path.resolve(__dirname, '..') + '/data/', (err, files) => {
    if (err) {
      console.log(err.message);
      res.status(404).send({ message: MESSAGE.SOURCE_FILE_INACCESSIBLE });
    } else {
      res.status(200).send({ 
        availableEndpoint: files.map(file => `${getCurrentURL(req)}/${file.replace('.json', '')}`)
      })
    }
  })
});

router.get('/:filename', ({ params }, res) => {
  fetchFileData(
    params.filename === undefined ? undefined : `${params.filename}`
  )
    .then(data => {
      res.status(200).send(data);
    })
    .catch(err => {
      console.log(err.message);
      res.status(404).send({ message: MESSAGE.SOURCE_FILE_INACCESSIBLE });
    });
});

module.exports = router;
