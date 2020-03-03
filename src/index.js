import "./styles/index.scss";
import {getYesterdaysDate} from './scripts/date_util';
import {makeBarChart} from './scripts/d3_bar_chart';
import { makeHorzBarChart} from './scripts/stacked_horz_bar_chart';
import { makeHorzBarGraph} from './scripts/horz_bar_graph';

// ** DATA: ** // 
// these are aggregated files of all cases, deaths, and recoveries from https://github.com/CSSEGISandData/COVID-19/tree/master/csse_covid_19_data/csse_covid_19_time_series

// CONFIRMED CASES: https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Confirmed.csv
// DEATHS: https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Deaths.csv
// RECOVERED: https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Recovered.csv


window.addEventListener("DOMContentLoaded", () => {
    const card = document.createElement("div");
    card.classList.add("card", "center");
    card.innerHTML = `<h2>As of ${getYesterdaysDate()}</h2>`;
    document.body.append(card);


    // CONFIRMED CASES
    const confirmedContainer = document.createElement("div");
    confirmedContainer.classList.add("container");
    confirmedContainer.innerHTML = `<h2>Confirmed Cases</h2>`;

    d3.csv('https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Confirmed.csv')
        .then(data => {
            data.forEach(row => {
                // console.log to see the whole object and how to manipulate it
                // console.log(row);


                let rowRender = document.createElement("div");
                rowRender.innerHTML = `<p>${row['Country/Region']} - ${row['Province/State']} - ${row[getYesterdaysDate()]} </p>`
                confirmedContainer.append(rowRender);
            })
        })

    document.body.append(confirmedContainer);


    
    // DEATHS
    const deathsContainer = document.createElement("div");
    deathsContainer.classList.add("container");
    deathsContainer.innerHTML = `<h2>Deaths</h2>`;
    d3.csv('https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Deaths.csv')
        .then(data => {
            data.forEach(row => {
                let rowRender = document.createElement("div");
                rowRender.innerHTML = `<p>${row['Country/Region']} - ${row['Province/State']} - ${row[getYesterdaysDate()]} </p>`
                deathsContainer.append(rowRender);
            })
        })

    document.body.append(deathsContainer);

    // RECOVERED CASES
    const recoveredContainer = document.createElement("div");
    recoveredContainer.classList.add("container");
    recoveredContainer.innerHTML = `<h2>Recovered Cases</h2>`;

    d3.csv('https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Recovered.csv')
        .then(data => {
            data.forEach(row => {
                let rowRender = document.createElement("div");
                rowRender.innerHTML = `<p>${row['Country/Region']} - ${row['Province/State']} - ${row[getYesterdaysDate()]} </p>`
                recoveredContainer.append(rowRender);

            })
        })
    
        document.body.append(recoveredContainer);
        
        // placeholders playing around with d3:
        d3.selectAll("h1").style("color", "purple")
        d3.selectAll("h2").style("color", "blue")

        makeBarChart();

        // this one is an example found online
        // makeHorzBarChart();
    
    
        // this is the real one
        makeHorzBarGraph();


        // stacked chart
        // https://observablehq.com/@d3/stacked-horizontal-bar-chart
});