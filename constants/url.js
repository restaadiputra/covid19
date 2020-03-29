const BASE_JHU_CSSE_URL =
  'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/';

module.exports = {
  CONFIRM_GLOBAL: `${BASE_JHU_CSSE_URL}/time_series_covid19_confirmed_global.csv`,
  DEATH_GLOBAL: `${BASE_JHU_CSSE_URL}/time_series_covid19_deaths_global.csv`,
  RECOVERED_GLOBAL: `${BASE_JHU_CSSE_URL}/time_series_covid19_recovered_global.csv`,
  GITHUB_RAW_DATA: 'https://raw.githubusercontent.com/restaadiputra/covid19/master/data/data.json' 
};
