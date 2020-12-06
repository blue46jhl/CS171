/* * * * * * * * * * * * * *
*     class BrushVis       *
* * * * * * * * * * * * * */

class Brush1Vis {

    constructor(parentElement, data) {
        this.parentElement = parentElement;
        this.data = data;
        this.displayData = [];
        this.parseDate = d3.timeParse("%Y-%m");
        this.parseMonth = d3.timeParse("%b");
        this.parseYear = d3.timeParse("%Y");
        this.dateFormatter = d3.timeFormat("%Y-%b");

        // call method initVis
        this.initVis();
    }

// init brushVis

    initVis() {
        let vis = this;

        vis.margin = {top: 15, right: 20, bottom: 40, left: 50};
        vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right;
        vis.height = $("#" + vis.parentElement).height() - vis.margin.top - vis.margin.bottom;

        // SVG drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

        // clip path
        vis.svg.append("defs")
            .append("clipPath")
            .attr("id", "clip-2")
            .append("rect")
            .attr("width", vis.width)
            .attr("height", vis.height);

        // add title
        vis.svg.append('g')
            .attr('class', 'title')
            .append('text')
            .text('Monthly Heat Index from 1999 - 2010')
            .attr('transform', `translate(${vis.width / 2}, -5)`)
            .attr('text-anchor', 'middle')
            .attr("font-size", "12px")
            .attr("font-family", "georgia");

        // add sub-title
        vis.svg.append('g')
            .attr('class', 'sub-title')
            .append('text')
            .text('(Note: Apply the brush function by hovering your mouse close to the x-axis)')
            .attr('transform', `translate(${vis.width / 2}, 5)`)
            .attr('text-anchor', 'middle')
            .attr("font-size", "8px")
            .attr("font-family", "georgia")
            .style("font-style", "italic");

        // Axis title
        vis.svg.append("text")
            .attr("x", -50)
            .attr("y", -8)
            .text("Heat Index")
            .attr("font-size", "8px")
            .attr("font-family", "georgia");

        // init scales
        vis.x = d3.scaleTime().range([0, vis.width]);
        vis.y = d3.scaleLinear().range([vis.height, 0]);

        // init x & y axis
        vis.xAxis = vis.svg.append("g")
            .attr("class", "x-axis axis")
            .attr("transform", "translate(0," + vis.height + ")");

        vis.yAxis = vis.svg.append("g")
            .attr("class", "y-axis axis");

        // Define the clipping region
        vis.svg.append("defs")
            .append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("width", vis.width)
            .attr("height", vis.height);

        // init path group (IN CASE WE WANT TO ADD ADDITIONAL PATH LATER)
        vis.pathGroup = vis.svg.append('g').attr('class','pathGroup');

        // init path one
        vis.pathOne = vis.pathGroup
            .append('path')
            .attr("class", "pathOne");

        // init path generator
        vis.area = d3.area()
            .curve(d3.curveMonotoneX)
            .x(function(d) { return vis.x(d.time); })
            .y0(vis.y(0))
            .y1(function(d) { return vis.y(d.heatIndex); });

        // init brushGroup:
        vis.brushGroup = vis.svg.append("g")
            .attr("class", "brush")
            .attr("id", "second-brush");

        // init brush
        vis.brush = d3.brushX()
            .extent([[0, 0], [vis.width, vis.height]])
            .on("brush end", function (event) {
                d3.select(".y-labels").remove();

                selectedTimeRange = [vis.x.invert(event.selection[0]), vis.x.invert(event.selection[1])];
                console.log(selectedTimeRange[0]);
                console.log(vis.dateFormatter(selectedTimeRange[0]));

                // update the year range in html
                d3.select("#startSecond").text(vis.dateFormatter(selectedTimeRange[0]));
                d3.select("#endSecond").text(vis.dateFormatter(selectedTimeRange[1]));

                myRadialBarVis.wrangleData();
                myMapVis.wrangleData();
            });

        // (Filter, aggregate, modify data)
        vis.wrangleData();
    }

    wrangleData() {

        let vis = this;

        // Prepare data for the area chart
        vis.data.forEach(d => {
            // console.log(d);
            vis.displayData.push(
                {
                    time: vis.parseDate(d.MonthCode),
                    heatIndex: +d.HeatIndex,
                    casualty: +d.Deaths,
                    year: d.Year,
                    month: d.Month
                }
            );
        })

        // console.log(vis.displayData);

        this.updateVis();
    }

    updateVis(){

        let vis = this;

        // Call brush component
        vis.brushGroup.call(vis.brush);

        // update domains
        vis.x.domain( d3.extent(vis.displayData, function(d) { return d.time }) );
        vis.y.domain( d3.extent(vis.displayData, function(d) { return d.heatIndex }) );

        // console.log(vis.displayData);

        // Add the area
        // draw pathOne
        vis.pathOne.datum(vis.displayData)
            .transition().duration(400)
            .attr("d", vis.area)
            .attr("fill", "#ffc6b1")
            .attr("stroke", "lightyellow")
            .attr("clip-path", "url(#clip)");

        // draw x & y axis
        vis.xAxis.transition().duration(400).call(d3.axisBottom(vis.x).tickFormat(d3.timeFormat("%b %Y")));
        vis.yAxis.transition().duration(400).call(d3.axisLeft(vis.y).ticks(5));

        let bisectDate = d3.bisector(d => d.time).left;

        // TOOLTIPS
        // Add tooltip elements
        let tooltip = vis.svg.append("g")
            .style("display", "none");

        // append the x line
        tooltip.append("line")
            .attr("class", "x")
            .style("stroke", "#866157")
            .style("opacity", 0.5)
            .style("stroke-width", "2")
            .attr("y1", 0)
            .attr("y2", vis.height);

        // place the heat index at the intersection
        tooltip.append("text")
            .attr("class", "y1")
            .style("stroke", "white")
            .style("stroke-width", "3.5px")
            .style("opacity", 0.8)
            .attr("dx", 8)
            .attr("dy", "-.3em")
            .style("font-size", "14px");

        tooltip.append("text")
            .attr("class", "y2")
            .attr("dx", 8)
            .attr("dy", "-.3em")
            .style("fill", "saddlebrown")
            .style("font-size", "14px");

        // place the time at the intersection
        tooltip.append("text")
            .attr("class", "y3")
            .style("stroke", "white")
            .style("stroke-width", "3.5px")
            .style("opacity", 0.8)
            .attr("dx", 8)
            .attr("dy", "1em")
            .style("font-size", "14px");

        tooltip.append("text")
            .attr("class", "y4")
            .attr("dx", 8)
            .attr("dy", "1em")
            .style("fill", "saddlebrown")
            .style("font-size", "14px");

        // place casaulty at the intersection
        tooltip.append("text")
            .attr("class", "y5")
            .style("stroke", "white")
            .style("stroke-width", "3.5px")
            .style("opacity", 0.8)
            .attr("dx", 8)
            .attr("dy", "1em")
            .style("font-size", "14px");

        tooltip.append("text")
            .attr("class", "y6")
            .attr("dx", 8)
            .attr("dy", "1em")
            .style("fill", "saddlebrown")
            .style("font-size", "14px");

        // Append the rectangle to capture mouse
        vis.svg.append("rect")
            .attr("width", vis.width)
            .attr("height", vis.height - 20)
            .style("fill", "none")
            .style("pointer-events", "all")
            .on("mouseover", function() { tooltip.style("display", null); })
            .on("mouseout", function() { tooltip.style("display", "none"); })
            .on("mousemove", mousemove);

        function mousemove(event) {
            let x0 = vis.x.invert(d3.pointer(event)[0]),
                i = bisectDate(vis.displayData, x0, 1),
                d0 = vis.displayData[i - 1],
                d1 = vis.displayData[i],
                d = x0 - d0.time > d1.time - x0 ? d1 : d0;

            tooltip.select("text.y1")
                .attr("transform",
                    "translate(" + vis.x(d.time) + "," +
                    vis.y(d.heatIndex) + ")")
                .text("Heat Index: " + d.heatIndex);

            tooltip.select("text.y2")
                .attr("transform",
                    "translate(" + vis.x(d.time) + "," +
                    vis.y(d.heatIndex) + ")")
                .text("Heat Index: " + d.heatIndex);

            tooltip.select("text.y3")
                .attr("transform",
                    "translate(" + vis.x(d.time) + "," +
                    vis.y(d.heatIndex) + ")")
                .text("Time: " + vis.dateFormatter(d.time));

            tooltip.select("text.y4")
                .attr("transform",
                    "translate(" + vis.x(d.time) + "," +
                    vis.y(d.heatIndex) + ")")
                .text("Time: " + vis.dateFormatter(d.time));

            tooltip.select("text.y5")
                .attr("transform",
                    "translate(" + vis.x(d.time) + "," +
                    (vis.y(d.heatIndex) + 16) + ")")
                .text("Number of deaths: " + d.casualty);

            tooltip.select("text.y6")
                .attr("transform",
                    "translate(" + vis.x(d.time) + "," +
                    (vis.y(d.heatIndex) + 16) + ")")
                .text("Number of deaths: " + d.casualty);

            tooltip.select(".x")
                .attr("transform",
                    "translate(" + vis.x(d.time) + "," +
                    vis.y(d.heatIndex) + ")")
                .attr("y2", vis.height - vis.y(d.heatIndex));

        }

    }
}
