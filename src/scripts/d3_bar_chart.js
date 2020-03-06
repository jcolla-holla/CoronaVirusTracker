// example reference: https://www.freecodecamp.org/news/how-to-create-your-first-bar-chart-with-d3-js-a0e8ea2df386/


export const makeBarChart = () => {

    var svgWidth = 500;
    var svgHeight = 300;

    // need to change it to selectElementById
    var svg = d3.select('#barChartExample')
        .attr("width", svgWidth)
        .attr("height", svgHeight)
        .attr("class", "bar-chart");

    var dataset = [80, 100, 56, 120, 180, 30, 40, 120, 160];

    var barPadding = 5;
    var barWidth = (svgWidth / dataset.length);

    var barChart = svg.selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("y", function (d) {
            return svgHeight - d
        })
        .attr("height", function (d) {
            return d;
        })
        .attr("width", barWidth - barPadding)
        .attr("transform", function (d, i) {
            var translate = [barWidth * i, 0];
            return "translate(" + translate + ")";
        });

}
// <script>

//         // example from: http://duspviz.mit.edu/

//         // 		var ratData = [40, 100, 60, 40, 70, 60, 20, 40, 100, 60];

//         //     // Width and height of SVG
//         //         var w = 150;
//         //         var h = 175;

//         //         var arrayLength = ratData.length;
//         //         var maxValue = d3.max(ratData, function(d) {
//         //             return +d;
//         //         })
//         //         var x_axisLength = 100; // length of x-axis in our layout
//         //         var y_axisLength = 100; // length of y-axis in our layout

//         //         var yScale = d3.scaleLinear()
//         //             .domain([0, maxValue])
//         //             .range([0, y_axisLength])

//         //         //Create SVG element
//         //             var svg = d3.select("body")
//         //                 .append("svg")
//         //                 .attr("width", w)
//         //                 .attr("height", h);

//         //         //select and generate rectangle elements
//         // svg.selectAll("rect")
//         //     .data(ratData)
//         //     .enter()
//         //     .append("rect")
//         //     .attr("x", function (d, i) {
//         //         return i * (x_axisLength / arrayLength) + 30; // Set x coord of rect using length of array
//         //     })
//         //     .attr("y", function (d) {
//         //         return h - yScale(d); // Set y coordinate of rect using the y scale
//         //     })
//         //     .attr("width", (x_axisLength / arrayLength) - 1)
//         //     .attr("height", function (d) {
//         //         return yScale(d); // Set height of rectangle to data value
//         //     })
//         //     .attr("fill", "steelblue");

//         //    // Create y-axis
//         //     svg.append("line")
//         //         .attr("x1", 30)
//         //         .attr("y1", 75)
//         //         .attr("x2", 30)
//         //         .attr("y2", 175)
//         //         .attr("stroke-width", 2)
//         //         .attr("stroke", "black");

//         //     // Create x-axis
//         //     svg.append("line")
//         //         .attr("x1", 30)
//         //         .attr("y1", 175)
//         //         .attr("x2", 130)
//         //         .attr("y2", 175)
//         //         .attr("stroke-width", 2)
//         //         .attr("stroke", "black");

//         //         // title
//         //             svg.append("text")
//         //                 .attr("class", "y label")
//         //                 .attr("text-anchor", "end")
//         //                 .text("No. of Rats")
//         //                 .attr("transform", "translate(20, 20) rotate(-90)");


//         //         // create hover tooltips
//         //         var tooltip = d3.select("body")
//         //                 .append("div")
//         //                 .style("position", "absolute")
//         //                 .style("font-family", "'Open Sans', sans-serif")
//         //                 .style("font-size", "12px")
//         //                 .style("z-index", "10")
//         //                 .style("visibility", "hidden");

//         //         // Select and generate rectangle elements
//         //         // doesn't work b/c of d.rats doesn't exist... they uploaded CSV
//         //             svg.selectAll("rect")
//         //                 .data(ratData)
//         //                 .enter()
//         //                 .append("rect")
//         //                 .attr("x", function (d, i) {
//         //                     return i * (x_axisLength / arrayLength) + 30; // Set x coord
//         //                 })
//         //                 .attr("y", function (d) {
//         //                     return h - d.rats * (y_axisLength / maxValue); // Set y coord
//         //                 })
//         //                 .attr("width", (x_axisLength / arrayLength) - 1)
//         //                 .attr("height", function (d) {
//         //                     return d.rats * (y_axisLength / maxValue); // Set height to data value
//         //                 })
//         //                 .attr("fill", "steelblue")
//         //                 .on("mouseover", function (d) {
//         //                     return tooltip.style("visibility", "visible").text(d.city + ": " + d.rats);
//         //                 })
//         //                 .on("mousemove", function (d) {
//         //                     return tooltip.style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px").text(d.city + ": " + d.rats);
//         //                 })
//         //                 .on("mouseout", function (d) {
//         //                     return tooltip.style("visibility", "hidden");
//         //                 });
//     </script>