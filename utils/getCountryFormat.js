const countriesData = require('../data/country.json');

RegExp.escape = s => {
  return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};

module.exports = countryString => {
  let formatCountry = {
    'name': countryString,
    'alpha2': countryString,
    'alpha3': countryString,
    'region': '-',
    'subRegion': '-'
  };
  countriesData.some(countryCode => {
    // TODO: Fix country search where some country has the same part. Case 'India'
    let re = new RegExp('\\b' + RegExp.escape(countryString), 'i');
    if (countryCode.name.search(re) !== -1) {
      formatCountry = countryCode;
      return true;
    }

    if (typeof countryCode.alternativeName !== 'undefined') {
      if (
        Object.values(countryCode.alternativeName)
          .toString()
          .search(re) !== -1
      ) {
        formatCountry = countryCode;
        return true;
      }
    }
  });
  return formatCountry;
};
