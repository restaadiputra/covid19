const URL = require('./url');

module.exports = {
  confirmed: {
    url: URL.CONFIRM_GLOBAL,
    filename: 'confirmed'
  },
  deaths: {
    url: URL.DEATHS_GLOBAL,
    filename: 'deaths.'
  },
  recovered: {
    url: URL.RECOVERED_GLOBAL,
    filename: 'recovered'
  }
};
