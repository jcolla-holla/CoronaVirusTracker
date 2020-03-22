import {generateData} from './data_manipulation';
import { getDate, thousands_separators} from './date_util';

export const makeCountryBarChart = (countryName, countryData) => {
    let countryArr = countryData;
    // calendarInput and countriesButton below are used as arguments later on when rendering all countries graph again
    const calendarInput = document.getElementById("calendarInput");
    const countriesButton = document.getElementById("backToCountries")
    const chinaCheckbox = document.getElementById("chinaCheckbox"); 
    const chinaCheckboxLabel = document.getElementById("chinaCheckboxLabel"); 
    const countryDateInput = document.getElementById("calendarInputCountry");
    const graphTitle = document.getElementById("graphTitle");
    const checkboxOutline = document.getElementsByClassName("toggle");

    //ensure tooltips don't persist in buggy way
    const tooltips = document.getElementsByClassName("tooltip");
    for (let index = 0; index < tooltips.length; index++) {
        tooltips[index].remove();
    }

    let excludeChina;
    if (chinaCheckbox.checked) {
        excludeChina = true;
    } else {
        excludeChina = false;
    }

    checkboxOutline[0].setAttribute("class", "hide");
    chinaCheckbox.setAttribute("class", "hide");
    chinaCheckboxLabel.setAttribute("class", "hide");
    countriesButton.setAttribute("class", "show");
    graphTitle.innerHTML = countryName;
    // countryDateInput.setAttribute("class", "show");
    // calendarInput.setAttribute("class", "hide");

    // countryDateInput.value = calendarInput.value;


        // render new country graph
        
        // remove all bars related to all countries
        d3.selectAll("g").remove();

        //remove any provinces with less than 5 cases to avoid overcrowding the graph
        let filteredCountryArr = countryArr.filter(provinceState => provinceState.provinceStateCases > 10);
        
        // sort provinces by total number of cases, descending
        filteredCountryArr.sort((a, b) => (a.provinceStateCases < b.provinceStateCases ? 1 : -1));

        //add a value of cases - (deaths + recoveries).  Called adjustedTotalCases
        for (let index = 0; index < filteredCountryArr.length; index++) {
            let adjustedTotalCases = filteredCountryArr[index].provinceStateCases - (filteredCountryArr[index].provinceStateDeaths + filteredCountryArr[index].provinceStateRecoveries);
            Object.assign(filteredCountryArr[index], { "provinceStateAdjustedCases": adjustedTotalCases});       
        }

        // {provinceState: "Henan", provinceStateCases: 1273, provinceStateDeaths: 22, provinceStateRecoveries: 1250}
        let series = d3.stack()
            .keys(["provinceStateAdjustedCases", "provinceStateRecoveries","provinceStateDeaths"])
            (filteredCountryArr)
            .map(d =>
                (d.forEach((v, idx) => {
                    v.key = d.key;
                    v.idx = idx;
                }
                ), d)
            )


        // get the highest value
        var maxValue = d3.max(filteredCountryArr, function (d) {
            return +d.provinceStateCases;
        });

        // Width and height of SVG 
        var w = 1400;
        var h = 1200;
        let margin = ({ top: 30, right: 10, bottom: 10, left: 150 });

        //Width and height of graph itself within SVG
        var x_axisLength = 1200;
        // change y_axisLength to be smaller than h to hide bars with low values
        var y_axisLength = 1200;

        var xScale = d3.scaleLinear()
            .domain([0, maxValue])
            .range([0, x_axisLength])

        var yScale = d3.scaleBand()
            .domain(filteredCountryArr.map((provinceState) => provinceState["provinceState"]))
            .range([margin.top, y_axisLength - margin.bottom])
            .padding(0.1)


        // get sum of cases for the country
                // {provinceState: "Henan", provinceStateCases: 1273, provinceStateDeaths: 22, provinceStateRecoveries: 1250}
        let sumCases = 0;
        let sumAdjustedCases = 0;
        let sumDeaths = 0;
        let sumRecoveries = 0;
        for (let index = 0; index < filteredCountryArr.length; index++) {
            sumCases += filteredCountryArr[index].provinceStateCases;
            sumAdjustedCases += filteredCountryArr[index].provinceStateAdjustedCases;
            sumDeaths += filteredCountryArr[index].provinceStateDeaths;
            sumRecoveries += filteredCountryArr[index].provinceStateRecoveries;
        }

    
 
        var svg = d3.select("#horzBarChart")
            .attr("width", w)
            .attr("height", h)

        const chart = svg.append('g');

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
            return y_axisLength / 4
        })
        .text(() => {
            return `Total Reported Cases: ${thousands_separators(sumCases)}`
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
            return `Unresolved Reported Cases: ${thousands_separators(sumAdjustedCases)}`
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
            .data(d => d)
            .join("rect")
                .attr("x", function(d) {
                    return xScale(d[0]) + margin.left
                })
                .attr("y", function(d) {
                    return yScale(d.data.provinceState)
                })
                .attr("width", function(d) {
                    return xScale(d[1]) - xScale(d[0]); 
                })
                .attr("height", yScale.bandwidth())
            .attr("fill", function (d) {
                if (d.key === "provinceStateDeaths") {
                    return "#bf212e";
                } else if (d.key === "provinceStateRecoveries") {
                    return "#27b376";
                } else {
                    return "#264b96"
                }
            })
            .on("mouseover", function (d) {
                let msg = "";
                if (d.key === "provinceStateAdjustedCases") {
                    msg = "Unresolved Reported Cases";
                } else if (d.key === "provinceStateDeaths") {
                    msg = "Reported Deaths";
                } else if (d.key === "provinceStateRecoveries") {
                    msg = "Reported Recoveries"
                }
                return tooltip.style("visibility", "visible").text(`${msg}: ${d.data[d.key]}`)
            })
            .on("mousemove", function (d) {
                let msg = "";
                if (d.key === "provinceStateAdjustedCases") {
                    msg = "Unresolved Reported Cases";
                } else if (d.key === "provinceStateDeaths") {
                    msg = "Reported Deaths";
                } else if (d.key === "provinceStateRecoveries") {
                    msg = "Reported Recoveries"
                }
                return tooltip.style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px").text(`${msg}: ${thousands_separators(d.data[d.key])}`);
            })
            .on("mouseout", function (d) {
                return tooltip.style("visibility", "hidden");
            })
            .on("click", function (d) {
                // this resets the URL path
                window.location.search = "";

                tooltip.style("visibility", "hidden");
                generateData(excludeChina, getDate(calendarInput.value));
            })

        // might need to refactor this
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