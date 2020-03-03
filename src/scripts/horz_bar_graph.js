// modeled on: https://observablehq.com/@d3/stacked-horizontal-bar-chart
// helpful tutorial: https://www.youtube.com/watch?v=6Xynj_pBybc

// unclear if this is needed or not:
import { legend } from "d3-color-legend"


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


    // DATA NOT YET DEFINED
    // this just copied and pasted so far.  neeed to add rows and columns to d3 object
    series = d3.stack()
        .keys(data.columns.slice(1))
        (data)
        .map(d => (d.forEach(v => v.key = d.key), d))



    color = d3.scaleOrdinal()
        .domain(series.map(d => d.key))
        .range(d3.schemeSpectral[series.length])
        .unknown("#ccc")

    xAxis = g => g
        .attr("transform", `translate(0,${margin.top})`)
        .call(d3.axisTop(x).ticks(width / 100, "s"))
        .call(g => g.selectAll(".domain").remove())

    yAxis = g => g
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y).tickSizeOuter(0))
        .call(g => g.selectAll(".domain").remove())

    formatValue = x => isNaN(x) ? "N/A" : x.toLocaleString("en")

    height = data.length * 25 + margin.top + margin.bottom

    margin = ({ top: 30, right: 10, bottom: 0, left: 30 })


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