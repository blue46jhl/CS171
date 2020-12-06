/* * * * * * * * * * * * * *
*      class CasualtyVis   *
* * * * * * * * * * * * * */


class CasualtyVis {

    constructor(parentElement, heatData) {
        this.parentElement = parentElement;
        this.heatData = heatData;

        // parse date method
        this.parseDate = d3.timeParse("%Y");
        this.dateFormatter = d3.timeFormat("%Y");

        this.initVis()
    }

    initVis() {
        let vis = this;

        vis.margin = {top: 50, right: 40, bottom: 175, left: 80};

        vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right,
            vis.height = 400 - vis.margin.top - vis.margin.bottom;

        console.log($("#" + vis.parentElement).width());

        // init drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append('g')
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);

        // console.log(vis.height, vis.margin.top, vis.margin.bottom);

        // Axis title
        vis.svg.append("text")
            .attr("x", -75)
            .attr("y", -35)
            .text("Heat-Related Absolute Mortality")
            .attr("font-size", "10px")
            .attr("font-family", "georgia")
            .style("fill", "saddlebrown");

        // Legend
        vis.svg.append("circle")
            .attr("class", "legend-1")
            .attr("cx", 700)
            .attr("cy", -15)
            .attr("r", 20)
            .attr("stroke", "darkgrey")
            .style("fill", "#791212");

        vis.svg.append("circle")
            .attr("class", "legend-2")
            .attr("cx", 700)
            .attr("cy", -5)
            .attr("r", 10)
            .attr("stroke", "darkgrey")
            .style("fill", "rgb(164, 51, 56)");

        vis.svg.append("circle")
            .attr("class", "legend-3")
            .attr("cx", 700)
            .attr("cy", 0)
            .attr("r", 5)
            .attr("stroke", "darkgrey")
            .style("fill", "#FF8A8A");

        vis.svg.append("text")
            .attr("x", 725)
            .attr("y", -20)
            .text("3.82")
            .attr("font-size", "8px")
            .attr("font-family", "georgia")
            .style("fill", "#791212");

        vis.svg.append("text")
            .attr("x", 725)
            .attr("y", -8)
            .text("2.59")
            .attr("font-size", "8px")
            .attr("font-family", "georgia")
            .style("fill", "rgb(164, 51, 56)");

        vis.svg.append("text")
            .attr("x", 725)
            .attr("y", 0)
            .text("1.06")
            .attr("font-size", "8px")
            .attr("font-family", "georgia")
            .style("fill", "#FF8A8A");

        vis.svg.append("text")
            .attr("x", 700)
            .attr("y", -40)
            .text("Mortality Rate per Million")
            .attr("font-size", "8px")
            .attr("font-family", "georgia")
            .style("fill", "saddlebrown")
            .attr("text-anchor", "middle")
            .attr("font-weight", "bold");


        // Scales
        vis.x = d3.scaleTime()
            .range([0, vis.width]);

        vis.y = d3.scaleLinear()
            .range([vis.height, 0]);

        // Define x and y axis
        vis.xAxis = d3.axisBottom()
            .scale(vis.x)
            .tickFormat(d3.timeFormat("%Y"))
            .ticks(20);

        vis.yAxis = d3.axisLeft()
            .scale(vis.y)
            .ticks(5);

        //Create X axis
        vis.xAxisGroup = vis.svg.append("g")
            .attr("class", "x-axis axis")
            .attr("transform", "translate(0," + (vis.height) + ")");

        //Create Y axis
        vis.yAxisGroup = vis.svg.append("g")
            .attr("class", "y-axis axis")
            .attr("transform", "translate(" + (-40) + ",0)");

        // Define the clipping region
        vis.svg.append("defs")
            .append("clipPath")
            .attr("id", "clip-1")
            .append("rect")
            .attr("width", vis.width)
            .attr("height", vis.height);

        // init brushGroup:
        vis.brushGroup = vis.svg.append("g")
            .attr("class", "brush")
            .attr("id", "first-brush");

        // init brush
        vis.brush = d3.brushX()
            .extent([[0, 0], [vis.width, vis.height]])
            .on("brush end", function (event) {
                filteredTimeRange = [vis.x.invert(event.selection[0]), vis.x.invert(event.selection[1])];
                console.log(filteredTimeRange[0]);
                console.log(vis.dateFormatter(filteredTimeRange[0]));

                // update the year range in html
                d3.select("#start").text(vis.dateFormatter(filteredTimeRange[0]));
                d3.select("#end").text(vis.dateFormatter(filteredTimeRange[1]));

                // update myDotVis and myPopVisdata
                myDotVis.wrangleData();
                myPopVis.wrangleData();

            });

        // Append brush component here
        vis.svg.append("g")
            .selectAll("rect")
            .attr("y", -6)
            .attr("height", vis.height + 7);

        // Add a tooltip
        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'circleTooltip');

        vis.wrangleData();
    }

    /*
     *  Data wrangling
     */
    wrangleData() {
        let vis = this;

        // create empty data structure
        vis.myData = [];

        // Prepare data by looping over stations and populating empty data structure
        vis.heatData.forEach(d => {
            // console.log(d);
            vis.myData.push(
                {
                    time: d.year,
                    year: vis.parseDate(d.year),
                    total: +d.total,
                    population: +d.poplulation,
                    female: +d.female,
                    femalePopulation: +d.female_population,
                    male: +d.male,
                    malePopulation: +d.male_population
                }
            );
        })

        console.log(vis.myData);

        // Define displayData
        vis.displayData = [];

        let formatDecimalComma = d3.format(",.2f");
        vis.myData.forEach(d => {
            // console.log(d);
            vis.displayData.push(
                {
                    time: d.time,
                    year: d.year,
                    total: d.total,
                    population: d.population,
                    deathRate: formatDecimalComma(d.total / d.population * 1000000),
                    popHundredMillion: formatDecimalComma(d.population / 100000000)
                }
            );
        })

        console.log(vis.displayData);

        vis.updateVis();
    }

    updateVis() {
        let vis = this;

        // Call brush component
        vis.brushGroup.call(vis.brush);

        // Dot size scale
        vis.rateScale = d3.scaleLinear()
            .domain([d3.min(vis.displayData, d => d.deathRate), d3.max(vis.displayData, d => d.deathRate)])
            .range([10, 30]);

        // define colors
        vis.col_range_low = "#FF8A8A";
        vis.col_range_high = "#791212";

        vis.colorScale = d3.scaleLinear()
            .domain([d3.min(vis.displayData, d => d.deathRate), d3.max(vis.displayData, d => d.deathRate)])
            .range([vis.col_range_low, vis.col_range_high]);

        // Create the initial plot
        vis.x.domain(d3.extent(vis.displayData, d => d.year))
        vis.y.domain([0, d3.max(vis.displayData, d => d.total)]);

        // Draw circles
      vis.svg.selectAll("scatterplot")
            .data(vis.displayData)
            .enter()
            .append("circle")
            .attr("class", "scatterplot")
            .attr("fill", d => vis.colorScale(d.deathRate))
            .attr("cx", d => vis.x(d.year))
            .attr("cy", d => vis.y(d.total))
            .attr("stroke", "grey")
            .attr("r", d => vis.rateScale(d.deathRate))
            .on('mouseover', function (event, d) {
               // console.log(d);

                let xPosition = parseFloat(d3.select(this).attr("cx")) + 300;
                let yPosition = parseFloat(d3.select(this).attr("cy")) + vis.height / 2 + 50;

                vis.tooltip
                    .style("opacity", 1)
                    .style("left", xPosition + "px")
                    .style("top", yPosition + "px")
                    .html(`
                        <div style="border: thin solid grey; border-radius: 5px; background: lightgrey; padding: 20px;">
                        <h3> ${d.time}<h3>
                        <h4> Population: ${d.popHundredMillion + " hundred million"}</h4>      
                        <h4> Deaths (absolute): ${d.total}</h4>
                        <h4> Death (rate): ${d.deathRate + " per million"}</h4>                        
                        </div>`);
            })
            .on('mouseleave', function (event, d) {

                vis.tooltip
                    .style("opacity", 0)
                    .style("left", 0)
                    .style("top", 0)
                    .html(``);
            });

        vis.svg.select(".y-axis")
            .call(vis.yAxis)

        vis.svg.select(".x-axis")
            .call(vis.xAxis);

    }
}
