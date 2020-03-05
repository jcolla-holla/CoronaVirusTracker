// modeled on: https://observablehq.com/@d3/stacked-horizontal-bar-chart
// helpful tutorial: https://www.youtube.com/watch?v=6Xynj_pBybc

// unclear if this is needed or not:
import { legend } from "d3-color-legend"
import { ExportToCsv } from 'export-to-csv';

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
        // avoid double counting cases with adjustedCases
        let adjustedTotalCases = valuesWithoutColumn[index].totalCases - (valuesWithoutColumn[index].totalRecoveries + valuesWithoutColumn[index].totalDeaths);
        Object.assign(valuesWithoutColumn[index], { "Country/Region": keysWithoutColumn[index], "casesMinusDeathsAndRecoveries": adjustedTotalCases});
    }

    // starting everything over following: https://observablehq.com/@d3/stacked-horizontal-bar-chart

    // // HEAVILY MODELED FROM EXAMPLE:
    let series = d3.stack()
        .keys(["casesMinusDeathsAndRecoveries", "totalDeaths", "totalRecoveries"])
        (valuesWithoutColumn)
        .map(d => 
            (d.forEach((v, idx) => {
                v.key = d.key;
                v.idx = idx;
                }
                ), d)
            )
        // .order(d3.stackOrderAscending)

        // Width and height of SVG
        var w = 1600;
        var h = 800;
        let margin = ({ top: 30, right: 10, bottom: 0, left: 30 });

        // numCountries to be used to set height of svg
        var numCountries = valuesWithoutColumn.length;

        // China's numbers skews the numbers majorly since it is MUCH larger than other countries. This boolean simply removes it
        let showChina = false;

        if (showChina) {
            var numCountries = valuesWithoutColumn.length;
            var maxValue = d3.max(valuesWithoutColumn, function(d) {
                return +d.totalCases;
            })
        } else {
            var numCountries = valuesWithoutColumn.length - 1;
            var maxValue = d3.max(valuesWithoutColumn.slice(1), function (d) {
                return +d.totalCases;
            })
        }
        var x_axisLength = 500;
        var y_axisLength = 700;

        // not sure if this will work exactly how I want
        var xScale = d3.scaleLinear()
            .domain([0, maxValue])
            .range([0, x_axisLength])

        var yScale = d3.scaleLinear()
            .domain([0, numCountries])
            .range([0, y_axisLength])
            // .padding(0.08)

 

        // borrowed from: https://bl.ocks.org/Andrew-Reid/0aedd5f3fb8b099e3e10690bd38bd458
        // var yScale = d3.scaleBand()			// x = d3.scaleBand()	
        //     .rangeRound([0, height])	// .rangeRound([0, width])
        //     .paddingInner(0.05)
        //     .align(0.1);

        // var xScale = d3.scaleLinear()		// y = d3.scaleLinear()
        //     .rangeRound([0, width]);	// .rangeRound([height, 0]);

        debugger

        var svg = d3.select("#horzBarChart")
            .attr("width", w)
            .attr("height", h)
            .append("g")
            .selectAll("g")
            .data(series)
            .join("g")
            // need to loop through series (array of length 3)
            .selectAll("rect")
            .data(d => d)
            .join("rect")
                .attr("x", 20) // this should be ok
                .attr("y", function(d) {
                    // believe this is correct
                    return yScale(d.idx)
                }) 
                .attr("width", function(d, i) {
                    // this appears correct
                    return xScale(d[1] - d[0])
                })
                .attr("height", 10) //hardcoding this for now,
                // .attr("height", function(d) {
                //     yScale(d)}) 
                .attr("fill", function(d) {
                    if (d.key === "totalDeaths") {
                        return "red"; 
                    } else if (d.key === "totalRecoveries") {
                        return "green";
                    }  else {
                        return "steelblue"
                    }})
            // .append("title")
            //     .text("country")
    
    debugger   
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