// modeled heavily on: https://observablehq.com/@d3/stacked-horizontal-bar-chart

import { legend } from "d3-color-legend"

// data
    //  {
    // Mainland China: {Province/State: Array(31), totalCases: 80026, totalDeaths: 2912, totalRecoveries: 44810}
    // Thailand: { Province / State: Array(1), totalCases: 43, totalDeaths: 1, totalRecoveries: 31 }
    // Japan: { Province / State: Array(1), totalCases: 274, totalDeaths: 6, totalRecoveries: 32 }
    //  }

export const makeHorzBarGraph = (data, excludeChina) => {
    // set the columns key-value pair of data hardcoded to the columns of Mainland China (which all other countries should share)
    data.columns = Object.keys(data["Mainland China"]);

    // if any bars were there before, remove them
    d3.selectAll("g").remove();

    let keysWithoutColumn = Object.keys(data).slice(0, -1);
    let valuesWithoutColumn = Object.values(data).slice(0, -1);

    for (let index = 0; index < valuesWithoutColumn.length; index++) {
        // avoid double counting cases with adjustedCases
        let adjustedTotalCases = valuesWithoutColumn[index].totalCases - (valuesWithoutColumn[index].totalRecoveries + valuesWithoutColumn[index].totalDeaths);
        Object.assign(valuesWithoutColumn[index], { "Country/Region": keysWithoutColumn[index], "casesMinusDeathsAndRecoveries": adjustedTotalCases});
    }

    //sort by number of total cases so the bar graph shows up as expected
    valuesWithoutColumn.sort((a, b) => (a.totalCases < b.totalCases ? 1 : -1));
    
        // numCountries to be used to set height of svg
        var numCountries = valuesWithoutColumn.length;

        // China's numbers skews the numbers majorly since it is MUCH larger than other countries. This boolean simply removes it
        let removeChina = excludeChina;

        if (removeChina) {
            var numCountries = valuesWithoutColumn.length - 1;
            var maxValue = d3.max(valuesWithoutColumn.slice(1), function (d) {
                return +d.totalCases;
            })
            valuesWithoutColumn = valuesWithoutColumn.slice(1);
        } else {
            var numCountries = valuesWithoutColumn.length;
            var maxValue = d3.max(valuesWithoutColumn, function(d) {
                return +d.totalCases;
            })
        }

    //the order of the stacks for each country is determined by the order of .keys
    let series = d3.stack()
        .keys(["casesMinusDeathsAndRecoveries", "totalRecoveries", "totalDeaths"])
        (valuesWithoutColumn)
        .map(d =>
            (d.forEach((v, idx) => {
                v.key = d.key;
                v.idx = idx;
            }
            ), d)
        )


    // Width and height of SVG 
    var w = 1000;
    var h = 1200;
    let margin = ({ top: 30, right: 10, bottom: 0, left: 30 });

    //Width and height of graph itself within SVG
    var x_axisLength = 600;
    var y_axisLength = 1000;
            
        var svg = d3.select("#horzBarChart")
                .attr("width", w)
                .attr("height", h)
        
        const chart = svg.append('g')

        var xScale = d3.scaleLinear()
            .domain([0, maxValue])
            .range([0, x_axisLength])

        var yScale = d3.scaleBand()
            .domain(valuesWithoutColumn.map((country, i) => i))
            .range([margin.top, y_axisLength - margin.bottom])
            .padding(0.1)

        chart.append("g")
            .selectAll("g")
            .data(series)
            .join("g")
            .selectAll("rect")
            // need to loop through series (array of length 3)
            .data(d => d)
            .join("rect")
                .attr("x", function(d) {
                    return xScale(d[0]) + margin.left
                })
                .attr("y", function(d) {
                    return yScale(d.idx)
                }) 
                .attr("width", function(d, i) {
                    return xScale(d[1] - d[0])
                })
                .attr("height", yScale.bandwidth())
                .attr("fill", function(d) {
                    if (d.key === "totalDeaths") {
                        return "#bf212e"; 
                    } else if (d.key === "totalRecoveries") {
                        return "#27b376";
                    }  else {
                        return "#264b96"
                    }})
                .append("title")
                    .text(d => {
                        // debugger 
                        // this isn't put in the right place right now
                        return `${d.data["Country/Region"]} ${d.key}
    ${d.data[d.key]}`});

    // let xAxis = g => g
    //     .attr("transform", `translate(0,${margin.top})`)
    //     .call(d3.axisTop(x).ticks(width / 100, "s"))
    //     .call(g => g.selectAll(".domain").remove())

    //     svg.append("g")
    //         .call(xAxis);
}






















    // const svg = d3.select("#horzBarChart")

    // let margin = ({ top: 30, right: 10, bottom: 0, left: 30 })

    // let height = valuesWithoutColumn.length * 25 + margin.top + margin.bottom

    // var y = d3.scaleBand()			// x = d3.scaleBand()	
    //     .domain(valuesWithoutColumn.map(d => 
    //         {   debugger
    //             d["Country/Region"]}))
    //     .range([margin.top, height - margin.bottom])
    //     .padding(0.08)    
    // // .rangeRound([0, svgHeight])	// .rangeRound([0, width])
    // //     .paddingInner(0.05)
    // //     .align(0.1);

    // var x = d3.scaleLinear()		// y = d3.scaleLinear()
    //     .domain([0, d3.max(series, d => d3.max(d, d => d[1]))])
    //     .range([margin.left, width - margin.right])
    // // .rangeRound([0, svgWidth]);	// .rangeRound([height, 0]);

    // var z = d3.scaleOrdinal()
    //     .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

    // // neeed to add rows and columns to d3 object
    // // https://observablehq.com/@lwthatcher/energy-well-stacks-using-d3


    // let formatValue = x => isNaN(x) ? "N/A" : x.toLocaleString("en")




    // var svgWidth = 500;
    // var svgHeight = 300;

    // // explore order options later: https://github.com/d3/d3-shape/blob/master/README.md#stack
    // // let stack = d3.stack()
    // //     .keys(["totalCases", "totalDeaths", "totalRecoveries"])
    // //     .order(d3.stackOrderNone)
    // //     .offset(d3.stackOffsetNone)

    // // let series = stack(valuesWithoutColumn);








// // just doing this for now to export CSV to play with outside of VSCode
    // const options = {
    //     fieldSeparator: ',',
    //     quoteStrings: '"',
    //     decimalSeparator: '.',
    //     showLabels: true,
    //     showTitle: true,
    //     title: 'data',
    //     useTextFile: false,
    //     useBom: true,
    //     useKeysAsHeaders: true,
    //     // headers: ['Column 1', 'Column 2', etc...] <-- Won't work with useKeysAsHeaders present!
    // };

    // const csvExporter = new ExportToCsv(options);
    // csvExporter.generateCsv(valuesWithoutColumn);




    // csvExporter.generateCsv(series);    
        // these .order and .offset don't work here but apparently are the default behavior anyways?
        // .order(d3.stackOrderNone)
        // .offset(d3.stackOffsetNone)

    // let color = d3.scaleOrdinal()
    //     .domain(series.map(d => d.key))
    //     .range(d3.schemeSpectral[series.length])
    //     .unknown("#ccc")

    // debugger
    // // hardcoding svgWidth for now
    // let svg = d3.select("#horzBarChart")
    //     .attr("viewBox", [0, 0, svgWidth, svgHeight])
    //     .append("g")
    //     .selectAll("g")
    //     .data(series)
    //     .join("g")
    //         .attr("fill", d => color(d.key)) // d.key = "totalCases" etc
    //     .selectAll("rect")
    //     .data(d => d)
    //     .join("rect")
    //         .attr("x", d => {
    //             debugger
    //             x(d[0])}
    //             )
    //         // replacing: .attr("y", (d, i) => y(d.data.name))
    //         .attr("y", (d, i) => y(d.data["Country/Region"]))
    //         .attr("width", d => x(d[1]) - x(d[0]))
    //         .attr("height", 20)
    //         // () => {
    //         //     debugger
    //         //     return y.bandwidth()})
    //     .append("title")
    //     .text(d => `${d.data["Country/Region"]} ${d.key} ${formatValue(d.key)}`);

    //     debugger

    // let xAxis = g => g
    //     .attr("transform", `translate(0,${margin.top})`)
    //     .call(d3.axisTop(x).ticks(svgWidth / 100, "s"))
    //     .call(g => g.selectAll(".domain").remove())

    // let yAxis = g => g
    //     .attr("transform", `translate(${margin.left},0)`)
    //     .call(d3.axisLeft(y).tickSizeOuter(0))
    //     .call(g => g.selectAll(".domain").remove())

    // svg.append("g")
    //     .call(xAxis);

    // svg.append("g")
    //     .call(yAxis);

    // return svg.node();