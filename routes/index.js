const router = require('express').Router();
const source = require('./source');
const summary = require('./summary');
const cases = require('./cases');

router.use('/', summary);
router.use('/source', source);
router.use('/cases', cases);

module.exports = router;
