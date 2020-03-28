const router = require('express').Router();
const source = require('./source');
const summary = require('./summarry');

router.use('/', summary);
router.use('/source', source);

module.exports = router;
