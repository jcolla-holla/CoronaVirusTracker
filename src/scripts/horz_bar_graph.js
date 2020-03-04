// modeled on: https://observablehq.com/@d3/stacked-horizontal-bar-chart
// helpful tutorial: https://www.youtube.com/watch?v=6Xynj_pBybc

// unclear if this is needed or not:
import { legend } from "d3-color-legend"

// data
    //  {
    // Mainland China: {Province/State: Array(31), totalCases: 80026, totalDeaths: 2912, totalRecoveries: 44810}
    // Thailand: { Province / State: Array(1), totalCases: 43, totalDeaths: 1, totalRecoveries: 31 }
    // Japan: { Province / State: Array(1), totalCases: 274, totalDeaths: 6, totalRecoveries: 32 }
    //  }

export const makeHorzBarGraph = (data) => {
    debugger

    data.columns = Object.keys(data["Mainland China"]);

    debugger
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
}