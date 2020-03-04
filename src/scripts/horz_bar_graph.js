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

    var y = d3.scaleBand()			// x = d3.scaleBand()	
        .rangeRound([0, svgHeight])	// .rangeRound([0, width])
        .paddingInner(0.05)
        .align(0.1);

    var x = d3.scaleLinear()		// y = d3.scaleLinear()
        .rangeRound([0, svgWidth]);	// .rangeRound([height, 0]);

    var z = d3.scaleOrdinal()
        .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);



    // this just copied and pasted so far.  neeed to add rows and columns to d3 object
    // https://observablehq.com/@lwthatcher/energy-well-stacks-using-d3

    let series = d3.stack()
        .keys(["totalCases", "totalDeaths", "totalRecoveries"])
        .order(d3.stackOrderNone)
        .offset(d3.stackOffsetNone)
    
    // let series = d3.stack()
    //     .keys(data.columns.slice(1))
    //     debugger
    //     keysWithoutColumn.map(key => {
    //         debugger

    //         data[key].map(d => {
    //             debugger
    //             d.forEach(v => v.key = d.key), d
    //             debugger
    //         })    
    //     })
        
        // (data)
        // .map(d => (d.forEach(v => v.key = d.key), d))

    // color = d3.scaleOrdinal()
    //     .domain(series.map(d => d.key))
    //     .range(d3.schemeSpectral[series.length])
    //     .unknown("#ccc")

    let xAxis = g => g
        .attr("transform", `translate(0,${margin.top})`)
        .call(d3.axisTop(x).ticks(width / 100, "s"))
        .call(g => g.selectAll(".domain").remove())

    let yAxis = g => g
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y).tickSizeOuter(0))
        .call(g => g.selectAll(".domain").remove())

    let formatValue = x => isNaN(x) ? "N/A" : x.toLocaleString("en")

    let margin = ({ top: 30, right: 10, bottom: 0, left: 30 })

    let height = data.length * 25 + margin.top + margin.bottom


    var svgWidth = 500;
    var svgHeight = 300;

    // hardcoding svgWidth for now
    let svg = d3.select("#horzBarChart")
        .attr("viewBox", [0, 0, svgWidth, svgHeight])

    // not sure if this works:
    // "g" here represents a graph element I guess

    debugger
    // this isn't working at all:
    svg.append("g")
        .selectAll("g")
        .data(series)
        .join("g")
            .attr("fill", d => color(d.key))
        .data(d => d)
        .join("rect")
            .attr("x", d => x(d[0]))
            // replacing: .attr("y", (d, i) => y(d.data.name))
            .attr("y", (d, i) => y(d['Country/Region']))
            .attr("width", d => x(d[1]) - x(d[0]))
            .attr("height", y.bandwidth())
        .append("title")
        .text(d => `${d.data.name} ${d.key}
        ${formatValue(d['Country/Region'])}`);

    svg.append("g")
        .call(xAxis);

    svg.append("g")
        .call(yAxis);
    

    return svg.node();
}