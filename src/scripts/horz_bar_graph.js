// modeled heavily on: https://observablehq.com/@d3/stacked-horizontal-bar-chart

import { legend } from "d3-color-legend"
import { makeCountryBarChart} from "./country_bar_chart";
import { thousands_separators} from "./date_util";

// data
    //  {
    // Mainland China: {Province/State: Array(31), totalCases: 80026, totalDeaths: 2912, totalRecoveries: 44810}
    // Thailand: { Province / State: Array(1), totalCases: 43, totalDeaths: 1, totalRecoveries: 31 }
    // Japan: { Province / State: Array(1), totalCases: 274, totalDeaths: 6, totalRecoveries: 32 }
    // ...
    //  }

export const makeHorzBarGraph = (data, excludeChina) => {
    const countriesButton = document.getElementById("backToCountries")
    const chinaCheckbox = document.getElementById("chinaCheckbox"); 
    const chinaCheckboxLabel = document.getElementById("chinaCheckboxLabel"); 
    const tooltips = document.getElementsByClassName("tooltip");

    // make sure that tooltips don't persist in buggy way
    for (let index = 0; index < tooltips.length; index++) {
        tooltips[index].remove();
    }

    chinaCheckbox.setAttribute("class", "show");
    chinaCheckboxLabel.setAttribute("class", "show");
    countriesButton.setAttribute("class", "hide");

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

    // reduce the number of countries shown to the top 100 with highest cases
    valuesWithoutColumn = valuesWithoutColumn.slice(0, 50);
    keysWithoutColumn = keysWithoutColumn.slice(0, 50);

    
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
    var w = 1400;
    var h = 1800;
    let margin = ({ top: 30, right: 10, bottom: 10, left: 150 });

    //Width and height of graph itself within SVG
    var x_axisLength = 1200;
    // change y_axisLength to be smaller than h to hide bars with low values
    var y_axisLength = 1800;
            
        var svg = d3.select("#horzBarChart")
                .attr("width", w)
                .attr("height", h)
        
        const chart = svg.append('g')

        var xScale = d3.scaleLinear()
            .domain([0, maxValue])
            .range([0, x_axisLength])

        var yScale = d3.scaleBand()
            .domain(valuesWithoutColumn.map((country) => country["Country/Region"]))
            .range([margin.top, y_axisLength - margin.bottom])
            .padding(0.1)

        

        // sum total cases across all 50 countries shown
        let sumCases = 0;
        let sumAdjustedCases = 0;
        let sumDeaths = 0;
        let sumRecoveries = 0;
        for (let index = 0; index < valuesWithoutColumn.length; index++) {
            sumCases += valuesWithoutColumn[index].totalCases;
            sumAdjustedCases += valuesWithoutColumn[index].casesMinusDeathsAndRecoveries;
            sumDeaths += valuesWithoutColumn[index].totalDeaths;
            sumRecoveries += valuesWithoutColumn[index].totalRecoveries;
        }

        var tooltip = d3.select("body")
            .append("div")
            .attr("class", "tooltip")
            .style("position", "absolute")
            .style("font-family", "'Open Sans', sans-serif")
            .style("color", "gray")
            .style("font-size", "14px")
            .style("z-index", "1")
            .style("visibility", "hidden");

        // attempted to make container to modularize code more but couldn't figure it out quickly so moved on to solution I know works but is not very DRY
        // var statsContainer = chart.append("div")
        //     .attr("x", () => {
        //         return x_axisLength - margin.right
        //     })
        //     .attr("y", () => {
        //         return y_axisLength/4
        //     })
        //     .attr("width", 500)
        //     .attr("height", 500)

        // var totalCases = statsContainer.append("text")
        //     .attr("class", "totalCases")
        //     .style("font-family", "'Open Sans', sans-serif")
        //     .style("color", "black")
        //     .style("font-size", "14px")
        //     .style("z-index", "10")
        //     .text("hey")



        var totalCases = chart.append("text")
            .attr("class", "totalCases")
            .style("font-family", "'Open Sans', sans-serif")
            .style("color", "green")
            .style("font-size", "22px")
            .style("z-index", "10")
            .style("font-weight", "bold")
            .attr("x", () => {
                return x_axisLength - margin.right - 200
            })
            .attr("y", () => {
                return y_axisLength/4
            })
            .text(() => {
                return `Total Cases: ${thousands_separators(sumCases)}`
            })

        var totalAdjustedCount = chart.append("text")
            .attr("class", "totalAdjustedCount")
            .style("font-family", "'Open Sans', sans-serif")
            .style("color", "black")
            .style("font-size", "18px")
            .style("z-index", "10")
            .attr("x", () => {
                return x_axisLength - margin.right - 200
            })
            .attr("y", () => {
                return y_axisLength / 4 + 40
            })
            .text(() => {
                return `Unresolved Cases: ${thousands_separators(sumAdjustedCases)}`
            })

        var totalRecoveries = chart.append("text")
            .attr("class", "totalRecoveries")
            .style("font-family", "'Open Sans', sans-serif")
            .style("color", "black")
            .style("font-size", "18px")
            .style("z-index", "10")
            .attr("x", () => {
                return x_axisLength - margin.right - 200
            })
            .attr("y", () => {
                return y_axisLength / 4 + 60
            })
            .text(() => {
                return `Reported Recoveries: ${thousands_separators(sumRecoveries)}`
            })

        var totalDeaths = chart.append("text")
            .attr("class", "totalDeaths")
            .style("font-family", "'Open Sans', sans-serif")
            .style("color", "black")
            .style("font-size", "18px")
            .style("z-index", "10")
            .attr("x", () => {
                return x_axisLength - margin.right - 200
            })
            .attr("y", () => {
                return y_axisLength / 4 + 80
            })
            .text(() => {
                return `Reported Deaths: ${thousands_separators(sumDeaths)}`
            })

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
                    return yScale(d.data["Country/Region"])
                }) 
                .attr("width", function(d, i) {
                    return xScale(d[1]) - xScale(d[0])
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
                .on("mouseover", function(d) {
                    let msg = "";
                    if (d.key === "casesMinusDeathsAndRecoveries") {
                        msg = "Unresolved Cases";
                    } else if (d.key === "totalDeaths") {
                        msg = "Reported Deaths";
                    } else if (d.key === "totalRecoveries") {
                        msg = "Reported Recoveries"
                    }
                    return tooltip.style("visibility", "visible").text(`${msg}: ${d.data[d.key]}`)
                })
                .on("mousemove", function (d) {
                    let msg = "";
                    if (d.key === "casesMinusDeathsAndRecoveries") {
                        msg = "Unresolved Cases";
                    } else if (d.key === "totalDeaths") {
                        msg = "Reported Deaths";
                    } else if (d.key === "totalRecoveries") {
                        msg = "Reported Recoveries"
                    }
                    return tooltip.style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px").text(`${msg}: ${thousands_separators(d.data[d.key])}`);
                })
                .on("mouseout", function (d) {
                    return tooltip.style("visibility", "hidden");
                })
                // // to create a function that makes a country show page
                .on("click", function (d) {
                    tooltip.style("visibility", "hidden");
                    if (Object.keys(d.data["Province/State"][0]).length === 0) {
                        debugger
                        alert("No state, county, or state-level data currently available for " + d.data["Country/Region"])
                    } else {
                        makeCountryBarChart(d.data["Province/State"]);
                    }
                })

            

    let xAxis = g => g
        .attr("transform", `translate(${margin.left},${margin.top})`)
        .call(d3.axisTop(xScale).ticks(w / 100, "s"))
        .call(g => g.selectAll(".domain").remove())

    svg.append("g")
        .call(xAxis);

    let yAxis = g => g
        .attr("transform", `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(yScale).tickSizeOuter(0))
        .call(g => g.selectAll(".domain").remove())

    svg.append("g")
        .call(yAxis);

}
