const github = require('./github');
const arcgis = require('./arcgis');

const syncLocalData = async () => {
  try {
    arcgis.syncArcgisSummaryData();
    github.syncGithubConfirmedData();
    github.syncGithubDeathsData();
    github.syncGithubRecoveredData();
  } catch (error) {
    console.log('error', error);
  }
};

syncLocalData();
