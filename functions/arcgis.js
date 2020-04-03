const axios = require('axios').default;
const get = require('lodash/get');
const fileIO = require('../utils/fileIO');
const getCountryFormat = require('../utils/getCountryFormat');
const URL = require('../constants/url');

const mappingKeys = data => ({
  state: data.Province_State,
  country: data.Country_Region,
  subRegion: getCountryFormat(data.Country_Region).subRegion,
  region: getCountryFormat(data.Country_Region).region,
  alpha2: getCountryFormat(data.Country_Region).alpha2,
  alpha3: getCountryFormat(data.Country_Region).alpha3,
  lat: data.Lat,
  long: data.Long_,
  confirmed: data.Confirmed,
  death: data.Deaths,
  recovered: data.Recovered,
  active: data.Active,
  lastUpdate: new Date(data.Last_Update).toISOString()
});

const params = {
  f: 'json',
  outFields: '*',
  returnGeometry: 'false',
  where: '1=1',
  orderByFields: 'Country_Region asc,Province_State asc'
};

const syncArcgisSummaryData = () => {
  axios
    .get(URL.ARCGIS_SERVER_FEATURE, { params })
    .then(result => {
      const data = get(result, 'data.features', []);
      const fileData = {
        dataLastFetch: new Date().toISOString(),
        totalConfirmed: 0,
        totalDeaths: 0,
        totalRecovered: 0,
        countries: []
      };

      data.forEach(({ attributes }) => {
        fileData.totalConfirmed += attributes.Confirmed;
        fileData.totalDeaths += attributes.Deaths;
        fileData.totalRecovered += attributes.Recovered;
        fileData.countries.push(mappingKeys(attributes));
      });

      fileIO.writeFile('arcgis.json', fileData);
    })
    .catch(err => {
      console.log(err);
    });
};

module.exports = {
  syncArcgisSummaryData
};
