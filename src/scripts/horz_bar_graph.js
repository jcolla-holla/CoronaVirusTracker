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
    // set the columns key-value pair of data hardcoded to the columns of Mainland China (which all other countries should share)
    data.columns = Object.keys(data["Mainland China"]);

    let keysWithoutColumn = Object.keys(data).slice(0, -1);
    let valuesWithoutColumn = Object.values(data).slice(0, -1);

    for (let index = 0; index < valuesWithoutColumn.length; index++) {
        Object.assign(valuesWithoutColumn[index], { "Country/Region": keysWithoutColumn[index]});
    }

    var y = d3.scaleBand()			// x = d3.scaleBand()	
        .rangeRound([0, svgHeight])	// .rangeRound([0, width])
        .paddingInner(0.05)
        .align(0.1);

    var x = d3.scaleLinear()		// y = d3.scaleLinear()
        .rangeRound([0, svgWidth]);	// .rangeRound([height, 0]);

    var z = d3.scaleOrdinal()
        .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

    // neeed to add rows and columns to d3 object
    // https://observablehq.com/@lwthatcher/energy-well-stacks-using-d3


    let formatValue = x => isNaN(x) ? "N/A" : x.toLocaleString("en")

    let margin = ({ top: 30, right: 10, bottom: 0, left: 30 })

    let height = valuesWithoutColumn.length * 25 + margin.top + margin.bottom


    var svgWidth = 500;
    var svgHeight = 300;

    // explore order options later: https://github.com/d3/d3-shape/blob/master/README.md#stack
    // let stack = d3.stack()
    //     .keys(["totalCases", "totalDeaths", "totalRecoveries"])
    //     .order(d3.stackOrderNone)
    //     .offset(d3.stackOffsetNone)

    // let series = stack(valuesWithoutColumn);

    // HEAVILY MODELED FROM EXAMPLE:
    // series appears to match example structure perfectly
    let series = d3.stack()
        .keys(["totalCases", "totalDeaths", "totalRecoveries"])
        (valuesWithoutColumn)
        .map(d => (d.forEach(v => v.key = d.key), d))
        // these .order and .offset don't work here but apparently are the default behavior anyways?
        // .order(d3.stackOrderNone)
        // .offset(d3.stackOffsetNone)

    let color = d3.scaleOrdinal()
        .domain(series.map(d => d.key))
        .range(d3.schemeSpectral[series.length])
        .unknown("#ccc")

    debugger
    // hardcoding svgWidth for now
    let svg = d3.select("#horzBarChart")
        .attr("viewBox", [0, 0, svgWidth, svgHeight])
        .append("g")
        .selectAll("g")
        .data(series)
        .join("g")
            .attr("fill", d => color(d.key)) // d.key = "totalCases" etc
        .selectAll("rect")
        .data(d => d)
        .join("rect")
            .attr("x", d => {
                // debugger
                // d[0] = 0 for all d's I think
                x(d[0])})
            // replacing: .attr("y", (d, i) => y(d.data.name))
            .attr("y", (d, i) => {
                // seems to be correct
                y(d.data["Country/Region"])})
            .attr("width", d => {
                x(d[1]) - x(d[0])})
            .attr("height", 20)
            // () => {
            //     debugger
            //     return y.bandwidth()})
        .append("title")
        .text(d => {
            // formatValue might be off somehow?
            `${d.data["Country/Region"]} ${d.key}
        ${formatValue(d.key)}`});

        debugger

    let xAxis = g => g
        .attr("transform", `translate(0,${margin.top})`)
        .call(d3.axisTop(x).ticks(svgWidth / 100, "s"))
        .call(g => g.selectAll(".domain").remove())

    let yAxis = g => g
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y).tickSizeOuter(0))
        .call(g => g.selectAll(".domain").remove())

    svg.append("g")
        .call(xAxis);

    svg.append("g")
        .call(yAxis);
    
    return svg.node();
}