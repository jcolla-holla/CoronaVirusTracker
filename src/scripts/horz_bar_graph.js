// modeled heavily on: https://observablehq.com/@d3/stacked-horizontal-bar-chart

import { legend } from "d3-color-legend"
import { makeCountryBarChart} from "./country_bar_chart";

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

        var tooltip = d3.select("body")
            .append("div")
            .attr("class", "tooltip")
            .style("position", "absolute")
            .style("font-family", "'Open Sans', sans-serif")
            .style("color", "gray")
            .style("font-size", "14px")
            .style("z-index", "10")
            .style("visibility", "hidden");

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
                    return tooltip.style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px").text(`${msg}: ${d.data[d.key]}`);
                })
                .on("mouseout", function (d) {
                    return tooltip.style("visibility", "hidden");
                })
                // // to create a function that makes a country show page
                .on("click", function (d) {
                    tooltip.style("visibility", "hidden");
                    makeCountryBarChart(d.data["Country/Region"] ,d.data["Province/State"]);
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
