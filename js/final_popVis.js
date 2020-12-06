/* * * * * * * * * * * * * *
*      class PopVis        *
* * * * * * * * * * * * * */


class PopVis {

    constructor(parentElement, heatData) {
        this.parentElement = parentElement;
        this.heatData = heatData;
        // this.avgData = avgData;

        // parse date method
        this.parseDate = d3.timeParse("%Y");

        this.initVis()
    }

    initVis() {
        let vis = this;

        vis.margin = {top: 20, right: 20, bottom: 550, left: 25};

        vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right,
            vis.height = 800 - vis.margin.top - vis.margin.bottom;

        // init drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append('g')
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);

        // Title
        vis.svg.append('g')
            .attr('class', 'title')
            .append('text')
            .text('Mortality Rate per Million')
            .attr("x", 35)
            .attr("y", -10)
            .attr('text-anchor', 'middle')
            .attr("font-family", "Georgia")
            .attr("font-size", "8px")
            .attr("font-weight", "bold");

        // Initialize the X axis
        vis.x = d3.scaleBand()
            .range([ 0, vis.width ])
            .padding(1);

        vis.xAxis = vis.svg.append("g")
            .attr("transform", "translate(0," + vis.height + ")")

        // Initialize the Y axis
        vis.y = d3.scaleLinear()
            .range([vis.height, 0]);

        vis.yAxis = vis.svg.append("g")
            .attr("class", "myYaxis");

        // Add a tooltip
        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'popTooltip');

        vis.wrangleData();
    }

    /*
     *  Data wrangling
     */
    wrangleData() {
        let vis = this;

        // first, filter according to selectedTimeRange, init empty array
        let filteredData = [];

        // if there is a region selected
        if (filteredTimeRange.length !== 0) {
            //console.log('region selected', tableObject.selectedTimeRange, tableObject.selectedTimeRange[0].getTime() )

            // iterate over all rows the csv (dataFill)
            vis.heatData.forEach(row => {
                // and push rows with proper dates into filteredData
                if (filteredTimeRange[0].getTime() <= vis.parseDate(row.year).getTime() && vis.parseDate(row.year).getTime() <= filteredTimeRange[1].getTime()) {
                    filteredData.push(row);
                }
            });
        } else {
            filteredData = vis.heatData;
        }

        console.log(filteredData);

        // create empty data structure
        let displayData = [];

        // Prepare data by looping over stations and populating empty data structure
        filteredData.forEach(d => {
            // console.log(d);
            displayData.push(
                {
                    year: vis.parseDate(d.year),
                    total: +d.total,
                    female: +d.female,
                    male: +d.male,
                    Indian: +d.Indian,
                    Asian: +d.Asian,
                    Black: +d.Black,
                    White: +d.White,
                    yearRangeOne: +d.yearRangeOne,
                    yearRangeTwo: +d.yearRangeTwo,
                    yearRangeThree: +d.yearRangeThree,
                    yearRangeFour: +d.yearRangeFour,
                    population: +d.poplulation/1000000,
                    female_population: +d.female_population/1000000,
                    male_population: +d.male_population/1000000,
                    yearRangeOne_population: +d.yearRangeOne_population/1000000,
                    yearRangeTwo_population: +d.yearRangeTwo_population/1000000,
                    yearRangeThree_population: +d.yearRangeThree_population/1000000,
                    yearRangeFour_population: +d.yearRangeFour_population/1000000,
                    yearRangeThree_population: +d.yearRangeThree_population/1000000,
                    Indian_population: +d.Indian_population/1000000,
                    Asian_population: +d.Asian_population/1000000,
                    Indian_population: +d.Indian_population/1000000,
                    White_population: +d.White_population/1000000,
                    Black_population: +d.Black_population/1000000
                }
            );
        })

        // check out the global variable
        console.log("check out filtered data", displayData);

        let formatDecimalComma = d3.format(",.2f");
        annualRate = formatDecimalComma(displayData.reduce((acc, b) => acc + b.total, 0) / displayData.reduce((acc, b) => acc + b.population, 0));
        rateFemale = formatDecimalComma(displayData.reduce((acc, b) => acc + b.female, 0) / displayData.reduce((acc, b) => acc + b.female_population, 0));
        rateMale = formatDecimalComma(displayData.reduce((acc, b) => acc + b.male, 0) / displayData.reduce((acc, b) => acc + b.male_population, 0));
        rateIndian = formatDecimalComma(displayData.reduce((acc, b) => acc + b.Indian, 0) / displayData.reduce((acc, b) => acc + b.Indian_population, 0));
        rateAsian = formatDecimalComma(displayData.reduce((acc, b) => acc + b.Asian, 0) / displayData.reduce((acc, b) => acc + b.Asian_population, 0));
        rateBlack = formatDecimalComma(displayData.reduce((acc, b) => acc + b.Black, 0) / displayData.reduce((acc, b) => acc + b.Black_population, 0));
        rateWhite = formatDecimalComma(displayData.reduce((acc, b) => acc + b.White, 0) / displayData.reduce((acc, b) => acc + b.White_population, 0));
        rateYearRangeOne = formatDecimalComma(displayData.reduce((acc, b) => acc + b.yearRangeOne, 0) / displayData.reduce((acc, b) => acc + b.yearRangeOne_population, 0));
        rateYearRangeTwo = formatDecimalComma(displayData.reduce((acc, b) => acc + b.yearRangeTwo, 0) / displayData.reduce((acc, b) => acc + b.yearRangeTwo_population, 0));
        rateYearRangeThree = formatDecimalComma(displayData.reduce((acc, b) => acc + b.yearRangeThree, 0) / displayData.reduce((acc, b) => acc + b.yearRangeThree_population, 0));
        rateYearRangeFour = formatDecimalComma(displayData.reduce((acc, b) => acc + b.yearRangeFour, 0) / displayData.reduce((acc, b) => acc + b.yearRangeFour_population, 0));


        // console.log("check out annual average", annualAverage);

        rateDeaths = [
            {
                "group": "Total",
                "value": +annualRate
            }];

        rateDeathsByGender = [
            {
                "group": "Male",
                "value": +rateMale
            },
            {
                "group": "Female",
                "value": +rateFemale
            }];

        rateDeathsByRace = [
                {
                    "group": "White",
                    "value": +rateWhite
                },
                {
                    "group": "African",
                    "value": +rateBlack
                },
                {
                    "group": "Asian",
                    "value": +rateAsian
                },
                {
                    "group": "Indian",
                    "value": +rateIndian
                }];

        rateDeathsByAge = [
                {
                    "group": "0-24",
                    "value": +rateYearRangeOne
                },
                {
                    "group": "25-44",
                    "value": +rateYearRangeTwo
                },
                {
                    "group": "45-64",
                    "value": +rateYearRangeThree
                },
                {
                    "group": "65+",
                    "value": +rateYearRangeFour
                }];

        console.log(rateDeaths);
        console.log(rateDeathsByGender);
        console.log(rateDeathsByRace);
        console.log(rateDeathsByRace);

        // react to category change
        let selectedCategory = d3.select("#categorySelector").property("value");

        // Prepare data for pop chart
        popData = {
            absDeaths: rateDeaths,
            absDeathsByGender: rateDeathsByGender,
            absDeathsByRace: rateDeathsByRace,
            absDeathsByAge: rateDeathsByAge
        }

        console.log(popData);

        vis.updateVis();
    }

    updateVis() {
        let vis = this;

        // define x centers and colors for clusters
        let colorScale = d3.scaleOrdinal().range(["#465D99", '#728C9E', "#854852", "#948482"]);
        let myColors = ["#465D99", '#728C9E', "#854852", "#948482"];

        // x domain
        vis.x.domain(popData[selectedCategory].map(function(d) { return d.group; }))

        // y domain
        vis.y.domain([0, d3.max(popData[selectedCategory], function(d) { return d.value})]);

       // variable j: map data to existing line
        vis.j = vis.svg.selectAll(".myLine")
            .data(popData[selectedCategory])
        // update lines
        vis.j
            .enter()
            .append("line")
            .attr("class", "myLine")
            .merge(vis.j)
            .transition()
            .duration(1000)
            .attr("x1", function(d) { return vis.x(d.group); })
            .attr("x2", function(d) { return vis.x(d.group); })
            .attr("y1", function(d) { console.log(vis.y(d.value)); return vis.y(d.value); })
            .attr("y2", vis.height)
            .attr("stroke", "grey");

        console.log(vis.y(0));


        // variable u: map data to existing circle
        vis.u = vis.svg.selectAll("circle")
            .data(popData[selectedCategory])

        // update circles
        vis.u
            .enter()
            .append("circle")
            .attr("class", "myCircle")
            .merge(vis.u)
            .attr("fill", d => colorScale(d.group))
            .attr("stroke", "darkgrey")
            .attr("opacity", 0.8)
            .attr('stroke-width', '1px')
            .on('mouseover', function (event, d) {
                // console.log(d);

                d3.select(this)
                    .attr('stroke-width', '2px')
                    .attr("opacity", "0.6")
                    .attr("stroke", "darkred");

                vis.tooltip
                    .style("opacity", 1)
                    .style("left", event.pageX + 20 + "px")
                    .style("top", event.pageY + "px")
                    .html(`
                        <div style="border: thin solid grey; border-radius: 5px; background: lightgrey; padding: 20px;">
                        <h3> ${d.group}<h3>
                        <h4> Mortality rate: ${d.value + " per million"}</h4>
                        </div>`);
            })
            .on('mouseleave', function (event, d) {

                d3.select(this)
                    .attr('stroke-width', '1px')
                    .attr('stroke', "darkgrey")
                    .attr("opacity", "0.8");

                vis.tooltip
                    .style("opacity", 0)
                    .style("left", 0)
                    .style("top", 0)
                    .html(``);
            })
            .transition()
            .duration(1000)
            .attr("cx", function(d) { return vis.x(d.group); })
            .attr("cy", function(d) { return vis.y(d.value); })
            .attr("r", 6);

        vis.j.exit().remove();
        vis.u.exit().remove();

        // call axes
        vis.yAxis.transition().duration(1000).call(d3.axisLeft(vis.y).ticks(5));
        vis.xAxis.transition().duration(1000).call(d3.axisBottom(vis.x)).selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("font-size", "8px")
            .attr("transform", function(d) {
                return "rotate(-45)"
            });


    }

}


