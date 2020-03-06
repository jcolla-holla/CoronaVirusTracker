// this file to format the CSV files as needed to render as desired in graphs

import {getYesterdaysDate} from './date_util';
import {makeHorzBarGraph} from './horz_bar_graph';
import {graphAttempt2} from './graph_2';


export const generateData = (excludeChina = false, date = getYesterdaysDate()) => {
    let dataMaster = {};
    d3.csv('https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Confirmed.csv')
        .then(data => { //TOTAL CASES
            data.forEach(row => {                
                // ex values (rowCountryRegion):
                // Thailand  // US  // France
                let rowCountryRegion = row['Country/Region'];



                if (dataMaster[rowCountryRegion]) {
                    dataMaster[rowCountryRegion]["Province/State"].push(row["Province/State"]);
                    dataMaster[rowCountryRegion].totalCases += parseInt(row[date])
                } else {
                    dataMaster[rowCountryRegion] = { "Province/State": [row["Province/State"]], totalCases: parseInt(row[date]), totalDeaths: undefined, totalRecoveries: undefined };
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
                            dataMaster[rowCountryRegion].totalDeaths += parseInt(row[date])
                        } else {
                            dataMaster[rowCountryRegion].totalDeaths = parseInt(row[date]) 
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
                        dataMaster[rowCountryRegion].totalRecoveries += parseInt(row[date])
                    } else {
                        dataMaster[rowCountryRegion].totalRecoveries = parseInt(row[date]) 
                    };
                })

                // a heading that updates w the selected date displayed to user
                let title = document.getElementById("asOfTitle")
                title.innerHTML = `As of ${date}`;

                if (dataMaster["Mainland China"].totalRecoveries && dataMaster["Mainland China"].totalDeaths) {
                    makeHorzBarGraph(dataMaster, excludeChina);
                } else {
                    // something to investigate later - why sometimes not all data is there.  Related likely to syncronicity.  Temporary fix: call function generateData again.
                    generateData(excludeChina);
                }
            })
        }
    )
}






