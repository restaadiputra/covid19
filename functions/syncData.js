const github = require('./fetchGithubData');
const arcgis = require('./fetchArcgisData');

const syncData = async () => {
  try {
    arcgis();
    github.getConfirmedCases();
    github.getDeathsCases();
    github.getRecoveredCases();
  } catch (error) {
    console.log('error', error);
  }
};

syncData();
