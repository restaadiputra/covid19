const router = require('express').Router();
const source = require('./source');
const summary = require('./summary');
const cases = require('./cases');
const country = require('./country');
const series = require('./series');

router.use('/', summary);
router.use('/source', source);
router.use('/cases', cases);
router.use('/country', country);
router.use('/series', series);

module.exports = router;
