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
        availableEndpoint: files
          .filter(filename => filename !== 'country.json')
          .map(filename => `${getCurrentURL(req)}/${filename.replace('.json', '')}`)
      })
    }
  })
});

router.get('/:filename', (req, res) => {
  fetchFileData(
    req.params.filename === undefined ? undefined : `${req.params.filename}`
  )
    .then(data => {
      res.status(200).send(data);
    })
    .catch(err => {
      if (err.message.search('no such file or directory, open')) {
        res.status(404).send({ 
          message: MESSAGE.SOURCE_FILE_NOTFOUND,
          availableEndpoint: fs
            .readdirSync(path.resolve(__dirname, '..') + '/data/')
            .filter(filename => filename !== 'country.json')
            .map(filename => `${getCurrentURL(req)}/${filename.replace('.json', '')}`)
        })
      } else {
        res.status(500).send({ message: MESSAGE.SOURCE_FILE_INACCESSIBLE });
      }
    });
});

module.exports = router;
