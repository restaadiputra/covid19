# COVID-19 (2019-nCoV) API

All data comes from [Johns Hopkins CSSE Github Repository](https://github.com/CSSEGISandData/COVID-19) and inspired by [covid-19-api by mathdroid](https://github.com/mathdroid/covid-19-api). 

You should checkout both repo.



# How To Use ⚙️

This is a monolith app so there is a server run by Express that serve the API and also client made by using React which also serve by Express.

### Server API 🎛

- ##### Install dependencies (use `npm` or `yarn`)

  ```shell
  npm install
  ```

- ##### Pre-Run

  Before you run the Express Server your have to ensure that the source data file is exists. The default source of file is located in `/data/data.json` and `/data/summary.json`. If those two file is not present. You can create new one by run following command.

  ```shell
  node functions/syncData.js
  ```

  That command will genereate new file based on what the data in [Johns Hopkins CSSE Github Repository](https://github.com/CSSEGISandData/COVID-19). You can also use this to update the data in those file.

- ##### Run Express

  To start the server you can manually use 

  ```shell
  npm start
  ```

  or 

  ```shell
  DEBUG=covid-19-app:* npm start
  ```



### Client 🖥

This app use React as front-end which must be build first and then let the Express serve it as static file. It is located in `/client`.

- ##### Run for Development 🛠

  For development purposes you can run Express and and React in seperate service by go into directory `/client` and run :

  ```shell
  npm run start
  ```

  **NOTE**: because CORS issue. the order of which service must run first is important. The way React use Express API is by proxy in `/client/package.json`. This is the inside of `package.json`

  ```json
  ....
  "proxy": "http://localhost:8000",
  ....
  ```

  The value in proxy is **the host of Express server**. If you have different host or port, you have to change that in order for React app communicate with Express server without CORS issue.

  

- ##### Build for Production 💻

  The Express server will host the built React file inside `/client/build`. You can change the directory in `/app.js`. You have to build the react first before it is host/served by Express server by run

  ```shell
  npm build
  ```

*Note: for now Client is filled with simple UI for testing*



# Routes 📄

The basic routes `/` will be use by pre-build React app as it will be hosted by Express server. So all api will have prefix `/api`. All api only has **Get** methods.

| Route                  | Description                                                  |
| ---------------------- | ------------------------------------------------------------ |
| /                      | Return a summary of data and current detail of country       |
| /source                | Return all available routes for source                       |
| /source/:filename      | Return the original data/source based on filename. See all the available routes in `/source` |
| /cases                 | Return all available routes for cases                        |
| /cases/:caseType       | Return the data of current cases. `caseType` can be choosen between `confirmed`, `deaths`, and `recovered`. For example `/api/cases/confirmed` will return all latest confirmed cases. |
| /cases/:caseType/:date | This route is the extend of `/api/cases/:caseType` with addition that it accept date which use format `MM-DD-YYYY`. For example `/api/cases/confirmed/03-04-2020` will return the confirmed cases until March 04, 2020. Validation date used momentJs `isValid` function. |
| /country               | Return all available country                                 |
| /country/:alpha3       | Return current condition of a country based on its `alpha3`. You can get alpha3 code in `/api/country`. For example `/api/country/idn` will return the latest condition of Indonesia. **Note**: alpha3 is not *Case-Sensitive*. |
| /series                | Return a series of date containing the status of `confirmed`, `deaths`, and `recovered`. Accept two query which are `case` and `alpha3` to filter the series. |

**Full documentation for each routes can be read here**

# Use Github Hosted File

In my case, I use Github Action to automatically sync the data and store it in my repository which will be consumed by my Express instead of local data (`data.json` and `summary.json`). By default, the server use local data, but for me, I use my data in my repository. If you also want to do it, There are several things that need be looked up.

1. Add environment variable (`.env`) in project folder.

   ```
   USE_GITHUB=true
   ```

2. Add your own GitHub raw content link in `/constans/url.js`

   ```
   ....
   GITHUB_RAW_DATA: https://raw.githubusercontent.com/<your_github_data_file_links>,
   GITHUB_RAW_SUMMARY: https://raw.githubusercontent.com/<your_github_summary_file_links>
   ....
   ```



# License

MIT License 2020, restaadiputra.

Transitively from the John Hopkins Site, the data may not be used for commercial purposes.