// this file to format the CSV files as needed to render as desired in graphs

import { getYesterdaysDate, getYesterdaysDateDefault, getTwoDaysAgoDate} from './date_util';
import {makeHorzBarGraph} from './horz_bar_graph';
import { makeCountryBarChart} from './country_bar_chart';

export const generateData = (excludeChina = false, date = getTwoDaysAgoDate(), countryName = "") => {
    //  the blacklist accounts for cases that the Johns Hopkins data is formatted in error-inducing way and clearly is a data counting error.  ie - confirmed cases = -1.  Recoveries = undefined, etc.  Better to not report shaky data at all than make assumptions. 
    let blacklist = ["Cape Verde", "Cruise Ship", "Kosovo", "Diamond Princess", "Belize", "Laos", "Libya", "West Bank and Gaza", "Guinea-Bissau", "Mali", "Saint Kitts and Nevis"]

    let dataMaster = {};
    d3.csv('https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv')
        .then(data => { //TOTAL CASES
            data.forEach(row => {                
                // ex values (rowCountryRegion):
                // Thailand  // US  // France
                let rowCountryRegion = row['Country/Region'];
                let provinceState = row["Province/State"];

                if (blacklist.includes(rowCountryRegion)) {
                    // do nothing
                } else {
                    if (dataMaster[rowCountryRegion]) {
                        if (provinceState !== "") {
                            let provinceStateObj = new Object();
                            Object.assign(provinceStateObj, { provinceState: provinceState, provinceStateCases: parseInt(row[date]) });
                            dataMaster[rowCountryRegion]["Province/State"].push(provinceStateObj);
                        }
                        dataMaster[rowCountryRegion]["Province/State"][provinceState]
                        dataMaster[rowCountryRegion].totalCases += parseInt(row[date])
                    } else {
                        let provinceStateObj = new Object();
                        //if row["Province/State"] is "", it means that there is no province/state data for that row (and likely thee country is as granular data as we have)
                        if (provinceState !== "") {
                            Object.assign(provinceStateObj, {provinceState: provinceState, provinceStateCases: parseInt(row[date])});
                        }

                        dataMaster[rowCountryRegion] = { 
                            "Province/State": [provinceStateObj], 
                            totalCases: parseInt(row[date]), 
                            totalDeaths: undefined, 
                            totalRecoveries: undefined 
                        };
                    }
                }
            })
        })
    .then(
        () => { //DEATHS
            d3.csv('https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv')
                .then(data => {
                    data.forEach(row => {
                        let rowCountryRegion = row['Country/Region'];
                        let provinceState = row["Province/State"];

                        if (blacklist.includes(rowCountryRegion)) {
                            // do nothing
                        } else {
                            // set or upatde country-wide numbers
                            if (dataMaster[rowCountryRegion].totalDeaths) {
                                //if that country already exists in object
                                dataMaster[rowCountryRegion].totalDeaths += parseInt(row[date])
                            } else { 
                                // the first time that country is found in data, create that key in object
                                dataMaster[rowCountryRegion].totalDeaths = parseInt(row[date]) 
                            }


                            // set provinceState array values
                            if (provinceState !== "") {
                                let provinceStateArr = dataMaster[rowCountryRegion]["Province/State"];
                                for (let index = 0; index < provinceStateArr.length; index++) {
                                    if (provinceStateArr[index].provinceState === provinceState) {
                                        let provinceStateObj = provinceStateArr[index];
                                        Object.assign(provinceStateObj, { provinceStateDeaths: parseInt(row[date]) });
                                    }
                                }
                            }
                        }
                    })
                })
        }
    )
    .then(() => { // RECOVERED
        d3.csv('https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_recovered_global.csv')
            .then(data => {
                data.forEach(row => {
                    let rowCountryRegion = row['Country/Region'];
                    let provinceState = row["Province/State"];

                    // set or upatde country-wide numbers
                    if (blacklist.includes(rowCountryRegion)) {
                        // do nothing
                    } else {
                        if (dataMaster[rowCountryRegion].totalRecoveries) {
                            // + "20" to date b/c the recoveries CSV file date format as of March 26 2020 is "3/22/2020" while deaths and cases is "1/24/20".  This may change and need adjusting
                            dataMaster[rowCountryRegion].totalRecoveries += parseInt(row[date + "20"])
                        } else {
                            dataMaster[rowCountryRegion].totalRecoveries = parseInt(row[date + "20"]) 
                        };

                        // set provinceState array values
                        if (provinceState !== "") {
                            let provinceStateArr = dataMaster[rowCountryRegion]["Province/State"];
                            for (let index = 0; index < provinceStateArr.length; index++) {
                                if (provinceStateArr[index].provinceState === provinceState) {
                                    let provinceStateObj = provinceStateArr[index];
                                    Object.assign(provinceStateObj, { provinceStateRecoveries: parseInt(row[date]) });
                                }
                            }
                        }
                    }
                })

                // a heading that updates w the selected date displayed to user
                let title = document.getElementById("asOfTitle")
                
                title.innerHTML = `As of ${date}`;

                let paramCountry = window.location.search.slice(window.location.search.indexOf("=") + 1);

                if (dataMaster["China"].totalDeaths) {
                    if (countryName === "" && paramCountry === "") {
                        makeHorzBarGraph(dataMaster, excludeChina);
                    } else {
                        if (paramCountry !== "") {
                            makeCountryBarChart(paramCountry, dataMaster[paramCountry]["Province/State"])
                        } else {
                            makeCountryBarChart(countryName, dataMaster[countryName]["Province/State"])
                        }
                    }
                } else {
                    // something to investigate later - why sometimes not all data is there.  Related likely to syncronicity.  Temporary fix: call function generateData again.
                    generateData(excludeChina, date, countryName);
                }
            })
        }
    )
}






