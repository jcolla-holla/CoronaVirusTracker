import "./styles/index.scss";
import { getYesterdaysDate, getDate, getYesterdaysDateDefault} from './scripts/date_util';
import {makeBarChart} from './scripts/d3_bar_chart';
import { makeHorzBarChart} from './scripts/stacked_horz_bar_chart';
import { makeHorzBarGraph} from './scripts/horz_bar_graph';
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
    let yesterday = getYesterdaysDate()
    // this conditional protects against buggy date renderings if the user forces the day with the arrow keys above yesterdays date

    // NEED TO UPDATE LOGIC TO REFLECT HANDLECALENAR ALSO
    if (((yesterday.split("/")[0] <= date.split("/")[0]) && (yesterday.split("/")[1]) < parseInt(date.split("/")[1])) || date < "1/22/20") {
        date = yesterday;
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

    let yesterday = getYesterdaysDate()
    // this conditional protects against buggy date renderings if the user forces the day with the arrow keys above yesterdays date
    if (((yesterday.split("/")[0] <= date.split("/")[0]) && (yesterday.split("/")[1]) < parseInt(date.split("/")[1])) || date < "1/22/20") {
        date = yesterday;
        alert("Valid dates are between yesterday and January 22, 2020.  Showing default: yesterday.")
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
    calendarInput.defaultValue = getYesterdaysDateDefault();

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
        // this conditional protects against buggy date renderings if the user forces the day with the arrow keys above yesterdays date
        if (((yesterday.split("/")[0] <= date.split("/")[0]) && (yesterday.split("/")[1]) < parseInt(date.split("/")[1])) || date < "1/22/20") {
            date = yesterday;
            calendarInput.value = getYesterdaysDateDefault();
        }

        generateData(excludeChina, date);
    })


    calendarInput.addEventListener("change", () => {
        handleCalendar(calendarInput);
    })

    generateData();

    // below prints out all values by country in plain HTML
    
    // // CONFIRMED CASES
    // const confirmedContainer = document.createElement("div");
    // confirmedContainer.classList.add("container");
    // confirmedContainer.innerHTML = `<h2>Confirmed Cases</h2>`;

    // d3.csv('https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Confirmed.csv')
    //     .then(data => {
    //         data.forEach(row => {
    //             // console.log to see the whole object and how to manipulate it
    //             // console.log(row);

    //             let rowRender = document.createElement("div");
    //             rowRender.innerHTML = `<p>${row['Country/Region']} - ${row['Province/State']} - ${row[getYesterdaysDate()]} </p>`
    //             confirmedContainer.append(rowRender);
    //         })
    //     })

    // document.body.append(confirmedContainer);


    
    // // DEATHS
    // const deathsContainer = document.createElement("div");
    // deathsContainer.classList.add("container");
    // deathsContainer.innerHTML = `<h2>Deaths</h2>`;
    // d3.csv('https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Deaths.csv')
    //     .then(data => {
    //         data.forEach(row => {
    //             let rowRender = document.createElement("div");
    //             rowRender.innerHTML = `<p>${row['Country/Region']} - ${row['Province/State']} - ${row[getYesterdaysDate()]} </p>`
    //             deathsContainer.append(rowRender);
    //         })
    //     })

    // document.body.append(deathsContainer);

    // // RECOVERED CASES
    // const recoveredContainer = document.createElement("div");
    // recoveredContainer.classList.add("container");
    // recoveredContainer.innerHTML = `<h2>Recovered Cases</h2>`;

    // d3.csv('https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Recovered.csv')
    //     .then(data => {
    //         data.forEach(row => {
    //             let rowRender = document.createElement("div");
    //             rowRender.innerHTML = `<p>${row['Country/Region']} - ${row['Province/State']} - ${row[getYesterdaysDate()]} </p>`
    //             recoveredContainer.append(rowRender);

    //         })
    //     })
    
    //     document.body.append(recoveredContainer);
        
    //     // placeholders playing around with d3:
    //     d3.selectAll("h1").style("color", "purple")
    //     d3.selectAll("h2").style("color", "blue")

        // this was an example:
        // makeBarChart();


});