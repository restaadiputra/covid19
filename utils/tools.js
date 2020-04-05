// ALL FUNCTION HERE IS FOR TESTING/DATA CHECKING PURPOSES

const axios = require('axios').default;
const get = require('lodash/get');
const URL = require('../constants/url');
const countriesData = require('../data/country.json');

RegExp.escape = s => {
  return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};

const findCountryData = countryString => {
  let isFound = false;
  countriesData.forEach(country => {
    let foundByOri = false;

    let re = new RegExp('\\b' + RegExp.escape(countryString) + '$', 'i');

    if (country.name === countryString) {
      formatCountry = country;
      isFound = true;
    }

    if (!foundByOri) {
      if (typeof country.alternativeName !== 'undefined') {
        if (
          Object.values(country.alternativeName)
            .toString()
            .search(re) !== -1
        ) {
          formatCountry = country;
          isFound = true;
        }
      }
    }
  });

  return !isFound;
};

const findCountryWithoutData = () => {
  axios
    .get(URL.ARCGIS_SERVER_FEATURE, { params: {
      f: 'json',
      outFields: '*',
      returnGeometry: 'false',
      where: '1=1',
      orderByFields: 'Country_Region asc,Province_State asc'
    } })
    .then(result => {
      const temp = [];
      const data = get(result, 'data.features', []);
      data.forEach(({ attributes }) => {
        temp.push([
          attributes.Country_Region,
          findCountryData(attributes.Country_Region)
        ]);
      });
      const temp2 = temp.filter(e => e[1]);
      console.log(temp2);
    })
    .catch(err => {
      console.log(err);
    });
};

findCountryWithoutData();
