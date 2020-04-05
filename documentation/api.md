# COVID-19-App API Documentation ⚙️

## Endpoints 

All endpoints does not require an authentication and endpoints only has `GET` method.

### Summary status

Endpoint for viewing the current status of COVID19 all over the world

* [Summary](#summary) : `GET /api/`

### Source related

Endpoints for viewing the all the source file the API used.

* [Show available endpoints for source](#show-available-endpoints-for-source) : `GET /api/source/`
* [Show source file by filename](#show-source-file-by-filename) : `GET /api/source/:filename`

### Cases related

Endpoints for viewing the case-based status of COVID19 between `confirmed`, `deaths` and `recovered` with additional filter by `date`.

* [Show available endpoints for cases](#show-available-endpoints-for-cases) : `GET /api/cases/`
* [Show data by case type](#show-data-by-case-type) : `GET /api/cases/:caseType`
* [Show data by case type and date](cases-type.md) : `GET /api/cases/:caseType/:date`

### Country related

Endpoints for viewing the case-based status of COVID19 between `confirmed`, `deaths` and `recovered` with additional filter by `date`.

* [Show all country data](#show-all-country-data) : `GET /api/country/`
* [Show current status by country alpha3](#show-current-status-by-country-alpha3) : `GET /api/country/:alpha3`

### Series related

Endpoints for viewing the series of date containing the status of COVID19 each day. Accept two queries, `case` and `alpha3` for filtering

* [Show available endpoints](#show-series-of-date) : `GET /api/series/`



------



# Summary

Return the summary of current status of COVID19

**URL** : `/api/`

**Method** : `GET`

**Auth required** : NO

## Success Response ✅

**Code** : `200 OK`

**Content examples**

For default return. `/api/`

```json
{
    "dataLastFetch": "2020-04-05T02:37:00.415Z",
    "totalConfirmed": 1202236,
    "totalDeaths": 64753,
    "totalRecovered": 246457,
    "countries": [
        {
            "state": null,
            "country": "Afghanistan",
            "subRegion": "Southern Asia",
            "region": "Asia",
            "alpha2": "AF",
            "alpha3": "AFG",
            "lat": 33.93911,
            "long": 67.709953,
            "confirmed": 299,
            "deaths": 7,
            "recovered": 10,
            "active": 282,
            "lastUpdate": "2020-04-05T01:55:04.000Z"
        }
      ...
    ]
}
```





# Show Available Endpoints For Source

Return all available endpoints for source routes

**URL** : `/api/source/`

**Method** : `GET`

**Auth required** : NO

## Success Response ✅

**Code** : `200 OK`

**Content examples**

For default return. `/api/source`

```json
{
    "availableEndpoint": [
        "<host>/api/source/arcgis",
        "<host>/api/source/confirmed",
        "<host>/api/source/deaths",
        "<host>/api/source/recovered"
    ]
}
```





# Show Source File By Filename

Return source file by filename. The format for each filename is different between `arcgis` file and `confirmed, deaths, recovered` file.

**URL** : `/api/source/:filename`

**Method** : `GET`

**Auth required** : NO

## Success Response ✅

**Code** : `200 OK`

**Content examples**

For filename called `arcgis`. `/api/source/arcgis`

```json
{
    "dataLastFetch": "2020-04-05T02:37:00.415Z",
    "totalConfirmed": 1202236,
    "totalDeaths": 64753,
    "totalRecovered": 246457,
    "countries": [
        {
            "state": null,
            "country": "Afghanistan",
            "subRegion": "Southern Asia",
            "region": "Asia",
            "alpha2": "AF",
            "alpha3": "AFG",
            "lat": 33.93911,
            "long": 67.709953,
            "confirmed": 299,
            "deaths": 7,
            "recovered": 10,
            "active": 282,
            "lastUpdate": "2020-04-05T01:55:04.000Z"
        }
      ...
    ]
}
```



For filename called `recovered`.  `/api/source/recovered`

```json
[
    {
        "state": "",
        "country": "Afghanistan",
        "alpha2": "AF",
        "alpha3": "AFG",
        "region": "Asia",
        "subRegion": "Southern Asia",
        "lat": "33.0",
        "long": "65.0",
        "history": [
            [
                "1/22/20",
                0
            ],
            [
                "1/23/20",
                0
            ],
          ...
       ]
    }
]
```

## Fail Response ❌

**Code** : `404 Not Found`

**Content examples**

For  `:filename` that does not exists like `abcd`. `/api/source/abcd`

```json
{
    "message": "Source file is not found, please choose between below available endpoints.",
    "availableEndpoint": [
        "<host>/api/source/arcgis",
        "<host>/api/source/confirmed",
        "<host>/api/source/deaths",
        "<host>/api/source/recovered"
    ]
}
```







# Show Available Endpoints For Cases

Return all available endpoints for cases routes

**URL** : `/api/cases/`

**Method** : `GET`

**Auth required** : NO

## Success Response ✅

**Code** : `200 OK`

**Content examples**

For default return. `/api/source`

```json
{
    "availableEndpoint": [
        "<host>/api/cases/confirmed",
        "<host>/api/cases/deaths",
        "<host>/api/cases/recovered"
    ]
}
```





# Show Data By Case Type

Return data of COVID19 by case type.

**URL** : `/api/cases/:caseType`

**Method** : `GET`

**Auth required** : NO

## Success Response ✅

**Code** : `200 OK`

**Content examples**

For case type `confirmed`.  `/api/cases/confirmed`

```json
{
    "date": "04-05-2020",
    "cases": "confirmed cases",
    "totalConfirmed": 1202236,
    "country": [
        {
            "state": null,
            "country": "Afghanistan",
            "alpha2": "AF",
            "alpha3": "AFG",
            "region": "Asia",
            "subRegion": "Southern Asia",
            "lat": 33.93911,
            "long": 67.709953,
            "confirmed": 299
        },
      ...
    ]
}
```

## Fail Response ❌

**Code** : `404 Not Found`

**Content examples**

For  `:caseType` that does not exists like `abcd`.  `/api/cases/abcd`

```json
{
    "message": "Case-type is wrong. Choose between 'confirmed', 'deaths', and 'recovered'.",
    "availableEndpoint": [
        "http://localhost:8000/api/cases/confirmed",
        "http://localhost:8000/api/cases/deaths",
        "http://localhost:8000/api/cases/recovered"
    ]
}
```





# Show Data By Case Type and Date

Return data of COVID19 by case type and date.

**URL** : `/api/cases/:caseType/:date`

**Method** : `GET`

**Auth required** : NO

## Success Response ✅

**Code** : `200 OK`

**Content examples**

For case type `confirmed` and date `02-04-2020`.  `/api/cases/confirmed/02-04-2020`

```json
{
    "date": "02-04-2020",
    "cases": "confirmed cases",
    "totalConfirmed": 23892,
    "country": [
        {
            "state": "New South Wales",
            "country": "Australia",
            "alpha2": "AU",
            "alpha3": "AUS",
            "region": "Oceania",
            "subRegion": "Australia and New Zealand",
            "lat": "-33.8688",
            "long": "151.2093",
            "confirmed": 4
        },
      ...
    ]
}
```







# Show All Country Data

Return all country data

**URL** : `/api/country/`

**Method** : `GET`

**Auth required** : NO

## Success Response ✅

**Code** : `200 OK`

**Content examples**

For default return. `/api/country`

```json
[
    {
        "name": "Afghanistan",
        "alpha2": "AF",
        "alpha3": "AFG",
        "region": "Asia",
        "subRegion": "Southern Asia"
    },
    {
        "name": "Åland Islands",
        "alpha2": "AX",
        "alpha3": "ALA",
        "region": "Europe",
        "subRegion": "Northern Europe"
    },
    ...
]
```





# Show Current Status By Country Alpha3

Return data of COVID19 by case type.

**URL** : `/api/country/:alpha3`

**Method** : `GET`

**Auth required** : NO

## Success Response ✅

**Code** : `200 OK`

**Content examples**

For  `alpha3` with value `idn`.  `/api/country/idn`

```json
[
    {
        "state": null,
        "country": "Indonesia",
        "subRegion": "South-eastern Asia",
        "region": "Asia",
        "alpha2": "ID",
        "alpha3": "IDN",
        "lat": -0.7893,
        "long": 113.9213,
        "confirmed": 2092,
        "deaths": 191,
        "recovered": 150,
        "active": 1751,
        "lastUpdate": "2020-04-05T01:55:04.000Z"
    }
]
```

## Success Response ✅

**Code** : `200 OK`

**Content examples**

For  `alpha3` that does not exists like `abcd`.  `/api/country/abcd`

```json
[]
```





# Show Series of Date

Return the series of date that contained on of `confirmed`, `deaths` and `recovered` or all of them. Accept two queries key which are `case` and `alpha3` for filtering.

**URL** : `/api/series/`

**Method** : `GET`

**Auth required** : NO

## Success Response

**Code** : `200 OK`

**Content examples**

For default return without query keys. `/api/series`

```json
[
    {
        "1/22/20": {
            "confirmed": 555,
            "deaths": 17,
            "recovered": 28
        }
    },
    {
        "1/23/20": {
            "confirmed": 654,
            "deaths": 18,
            "recovered": 30
        }
    }
 ]
```



For  `alpha3` query with value `chn`. `/api/series?alpha3=chn`

```json
[
    {
        "1/22/20": {
            "confirmed": 548,
            "deaths": 17,
            "recovered": 28
        }
    },
    {
        "1/23/20": {
            "confirmed": 643,
            "deaths": 18,
            "recovered": 30
        }
    }
 ]
```



For  `case` query with value `confirmed`. `/api/series?case=confirmed`

```json
[
    {
        "1/22/20": {
            "confirmed": 555
        }
    },
    {
        "1/23/20": {
            "confirmed": 654
        }
    }
 ]
```



## Fail Response

**Code** : `400 Bad Request`

**Content examples**

For  `case` query with value `abcd`. `/api/series?case=abcd`

```json
{
    "message": "Case-type is wrong. Choose between 'confirmed', 'deaths', and 'recovered'."
}
```



