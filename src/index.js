import "./styles/index.scss";
import { getYesterdaysDate, getDate, getYesterdaysDateDefault, getTwoDaysAgoDate, getTwoDaysAgoDateDefault} from './scripts/date_util';
// import {makeBarChart} from './scripts/d3_bar_chart';
// import { makeHorzBarChart} from './scripts/stacked_horz_bar_chart';
// import { makeHorzBarGraph} from './scripts/horz_bar_graph';
import { generateData} from './scripts/data_manipulation';

// ** DATA: ** // 
// these are aggregated files of all cases, deaths, and recoveries from https://github.com/CSSEGISandData/COVID-19/tree/master/csse_covid_19_data/csse_covid_19_time_series

// CONFIRMED CASES: https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Confirmed.csv
// DEATHS: https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Deaths.csv
// RECOVERED: https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Recovered.csv

function handleClick(checkbox) {
    let excludeChina;
    if (checkbox.checked) {
        excludeChina = true;
    } else {
        excludeChina = false;
    }

    const calendarInput = document.getElementById("calendarInput");
    let date = getDate(calendarInput.value);
    // let yesterday = getYesterdaysDate();
    let twoDaysAgo = getTwoDaysAgoDate();
    // this conditional protects against buggy date renderings if the user forces the day with the arrow keys above yesterdays date

    // updated on March 26 2020 to swap yesterday with twoDaysAgo as Johns Hopkins data recency seems to have shifted
    // if (((yesterday.split("/")[0] <= date.split("/")[0]) && (yesterday.split("/")[1]) < parseInt(date.split("/")[1])) || date < "1/22/20") {
    if (((twoDaysAgo.split("/")[0] <= date.split("/")[0]) && (twoDaysAgo.split("/")[1]) < parseInt(date.split("/")[1])) || date < "1/22/20") {
        date = twoDaysAgo;
    }
    if (date.length === 0) {
        generateData(excludeChina);
    } else {
        generateData(excludeChina, date); 
    }
    
}

function handleCalendar(calendar) {
    let date = getDate(calendar.value);
    let excludeChina;
    const chinaCheckbox = document.getElementById("chinaCheckbox");
    if (chinaCheckbox.checked) {
        excludeChina = true;
    } else {
        excludeChina = false;
    }

    let yesterday = getYesterdaysDate();
    let twoDaysAgo = getTwoDaysAgoDate();
    // this conditional protects against buggy date renderings if the user forces the day with the arrow keys above yesterdays date
    if (((twoDaysAgo.split("/")[0] <= date.split("/")[0]) && (twoDaysAgo.split("/")[1]) < parseInt(date.split("/")[1])) || date < "1/22/20") {
        date = twoDaysAgo;
        alert("Valid dates are between 1/22/2020" + " and " + twoDaysAgo + "20.  Showing default: " + twoDaysAgo + "20.")
    }

    const graphTitle = document.getElementById("graphTitle");
    if (graphTitle.innerHTML !== "Global") {
        generateData(excludeChina, date, graphTitle.innerHTML);
    } else {
        generateData(excludeChina, date);
    }
}

window.addEventListener("DOMContentLoaded", () => {
    const card = document.createElement("div");
    card.classList.add("card", "center");
    // card.innerHTML = `<h2>As of ${getYesterdaysDate()}</h2>`;
    document.body.append(card);

    const chinaCheckbox = document.getElementById("chinaCheckbox");
    chinaCheckbox.addEventListener("click", () => {
        handleClick(chinaCheckbox);
    })

    const calendarInput = document.getElementById("calendarInput");
    calendarInput.defaultValue = getTwoDaysAgoDateDefault();

    const countriesButton = document.getElementById("backToCountries")
    countriesButton.addEventListener("click", () => {
        let excludeChina;
        if (chinaCheckbox.checked) {
            excludeChina = true;
        } else {
            excludeChina = false;
        }

        // this resets the URL path
        window.location.search = "";

        let date = getDate(calendarInput.value);
        let yesterday = getYesterdaysDate()
        let twoDaysAgo = getTwoDaysAgoDate();
        // this conditional protects against buggy date renderings if the user forces the day with the arrow keys above yesterdays date
        if (((twoDaysAgo.split("/")[0] <= date.split("/")[0]) && (twoDaysAgo.split("/")[1]) < parseInt(date.split("/")[1])) || date < "1/22/20") {
            date = twoDaysAgo;
            calendarInput.value = getTwoDaysAgoDateDefault();
        }

        generateData(excludeChina, date);
    })


    calendarInput.addEventListener("change", () => {
        handleCalendar(calendarInput);
    })

    generateData();
});