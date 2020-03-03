// modeled on: https://observablehq.com/@d3/stacked-horizontal-bar-chart

// https://bl.ocks.org/Andrew-Reid/0aedd5f3fb8b099e3e10690bd38bd458

// helpful tutorial: https://www.youtube.com/watch?v=6Xynj_pBybc


// visual of what I'm trying to achieve: https://docs.google.com/drawings/d/1f7Ad1zM_NhMkzkeBrxh1P67TwTov48Dgw5hvn9PxBmg/edit

// hacky way of capturing the columns of the CSV dynamically, to account for the fact that each day a new column with yesterday's date is added to the CSV
let dataArr = [];
let columns = [];

d3.csv('https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Confirmed.csv')
    .then(data => {
    data.forEach((row, idx) => {
            if (idx === data.length - 1) {
                columns.push(Object.keys(row));
            }
            dataArr.push(row);
        })
    })
    .then(() => {
        // console.log(dataArr);
        // [
        // 0: {Province/State: "Anhui", Country/Region: "Mainland China", Lat: "31.8257", Long: "117.2264", 1/22/20: "1", …}
        // 1: { Province / State: "Beijing", Country / Region: "Mainland China", Lat: "40.1824", Long: "116.4142", 1 / 22 / 20: "14", … }
        // 2: { Province / State: "Chongqing", Country / Region: "Mainland China", Lat: "30.0572", Long: "107.874", 1 / 22 / 20: "6", … }
        // 3: { Province / State: "Fujian", Country / Region: "Mainland China", Lat: "26.0789", Long: "117.9874", 1 / 22 / 20: "1", … }
        // ]
        
        
        // console.log(columns);
        // [
        //     "Province/State", "Country/Region", "Lat", "Long", "1/22/20", "1/23/20", "1/24/20", "1/25/20", "1/26/20", "1/27/20", "1/28/20", "1/29/20", ...
        // ]






    })


 





export const makeHorzBarGraph = () => {
    var svgWidth = 500;
    var svgHeight = 300;

    let svg = d3.select("#horzBarChart")
        .attr("viewBox", [0, 0, svgWidth, svgHeight])
        // .attr("width", svgWidth)
        // .attr("height", svgHeight)

    // not sure if this works:
    // "g" here represents a graph element I guess
    svg.append("g")
        .selectAll("g")
        .data()

    var y = d3.scaleBand()			// x = d3.scaleBand()	
        .rangeRound([0, svgHeight])	// .rangeRound([0, width])
        .paddingInner(0.05)
        .align(0.1);

    var x = d3.scaleLinear()		// y = d3.scaleLinear()
        .rangeRound([0, svgWidth]);	// .rangeRound([height, 0]);

    var z = d3.scaleOrdinal()
        .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);


    // dataArr
    // desired format:
    // [
    // 0: {Province/State: "Anhui", Country/Region: "Mainland China", Lat: "31.8257", Long: "117.2264", 1/22/20: "1", …}
    // 1: { Province / State: "Beijing", Country / Region: "Mainland China", Lat: "40.1824", Long: "116.4142", 1 / 22 / 20: "14", … }
    // 2: { Province / State: "Chongqing", Country / Region: "Mainland China", Lat: "30.0572", Long: "107.874", 1 / 22 / 20: "6", … }
    // 3: { Province / State: "Fujian", Country / Region: "Mainland China", Lat: "26.0789", Long: "117.9874", 1 / 22 / 20: "1", … }
    // ]


    // columns
    // desired format:
    // [
    //     "Province/State", "Country/Region", "Lat", "Long", "1/22/20", "1/23/20", "1/24/20", "1/25/20", "1/26/20", "1/27/20", "1/28/20", "1/29/20", ...
    // ]
}