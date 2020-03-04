// this file to format the CSV files as needed to render as desired in graphs

import {getYesterdaysDate} from './date_util';
import {makeHorzBarGraph} from './horz_bar_graph';

let dataMaster = {};
export const generateData = () => {
    d3.csv('https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Confirmed.csv')
        .then(data => { //TOTAL CASES
            data.forEach(row => {                
                // ex values (rowCountryRegion):
                // Thailand  // US  // France
                let rowCountryRegion = row['Country/Region'];

                if (dataMaster[rowCountryRegion]) {
                    dataMaster[rowCountryRegion]["Province/State"].push(row["Province/State"]);
                    dataMaster[rowCountryRegion].totalCases += parseInt(row[getYesterdaysDate()])
                } else {
                    dataMaster[rowCountryRegion] = { "Province/State": [row["Province/State"]], totalCases: parseInt(row[getYesterdaysDate()]), totalDeaths: undefined, totalRecoveries: undefined };
                }
            })
        })
    .then(
        () => { //DEATHS
            d3.csv('https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Deaths.csv')
                .then(data => {
                    data.forEach(row => {
                        let rowCountryRegion = row['Country/Region'];

                        if (dataMaster[rowCountryRegion].totalDeaths) {
                            dataMaster[rowCountryRegion].totalDeaths += parseInt(row[getYesterdaysDate()])
                        } else {
                            dataMaster[rowCountryRegion].totalDeaths = parseInt(row[getYesterdaysDate()]) 
                        }
                    })
                })
        }
    )
    .then(() => { // RECOVERED
        d3.csv('https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Recovered.csv')
            .then(data => {
                data.forEach(row => {
                    let rowCountryRegion = row['Country/Region'];
                    if (dataMaster[rowCountryRegion].totalRecoveries) {
                        dataMaster[rowCountryRegion].totalRecoveries += parseInt(row[getYesterdaysDate()])
                    } else {
                        dataMaster[rowCountryRegion].totalRecoveries = parseInt(row[getYesterdaysDate()]) 
                    };
                })


                //not sure if invoking makeHorzBarGraph here will cause issue
                if (dataMaster["Mainland China"].totalRecoveries) {
                    makeHorzBarGraph(dataMaster);
                }
            })
        }
    )
    // .then(() => {
        // THIS ERRORS OUT due to some syncronicity issue i think
    //     debugger
    //     makeHorzBarGraph(dataMaster);
    // })
}






