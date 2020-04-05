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
  countriesData.some(country => {
    let re = new RegExp('\\b' + RegExp.escape(countryString) + '$', 'i');

    if (country.name === countryString) {
      formatCountry = country;
      return true;
    }

    if (typeof country.alternativeName !== 'undefined') {
      if (
        Object.values(country.alternativeName)
          .toString()
          .search(re) !== -1
      ) {
        formatCountry = country;
        return true;
      }
    }
  });
  return formatCountry;
};
