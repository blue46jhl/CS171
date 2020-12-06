
function chart_name() {
    d3.select("#projectionVis")
        .select("svg")
        .remove()
    draw_chart(1);

}

function chart_hour() {
    d3.select("#projectionVis")
        .select("svg")
        .remove()
    draw_chart(2);
}

function draw_chart(a) {
    d3.json("data/heat_index_future.json")
        .then(function(data) {
            dataset = data;

            let margin = {top: 10, right: 60, bottom: 30, left: 60};

            let width = 1200 - margin.left - margin.right,
                height = 600 - margin.top - margin.bottom;

            let svg = d3.select("#projectionVis")
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")

            let div = d3.select("body").append("div")
                .attr("class", "tooltip")
                .style("opacity", 0);

            let sort = a;
            let citylist;
            if (sort == 1) {
                citylist = ["Atlanta", "Boston", "Los Angeles", "Miami", "Minneapolis", "Nashville", "New Orleans", "Phoenix", "Salt Lake City", "Seattle"]
            }
            else if (sort == 2) {
                citylist = ["Los Angeles", "Seattle", "Boston", "Minneapolis", "Salt Lake City", "Nashville", "Atlanta", "New Orleans", "Phoenix", "Miami"]
            }
            for (let i = 0; i < 10; i+=1) {
                let city_no = i;
                for (let j = 0; j < 3; j+=1) {
                    setTimeout(function timer() {
                        dataset1 = dataset[citylist[i] + "_" + j]
                        let city_list = j;
                        svg.selectAll("circle"+city_no+city_list)
                            .data(dataset1)
                            .enter()
                            .append("circle")
                            .attr("cx", (d) => {
                                return (city_no * 116) + 100;
                            })
                            .attr("cy", (d, i) => {
                                return city_list * -160 + 480;
                            })
                            .transition()
                            .duration(1800)
                            .attr("r", (d, i) => {
                                return d / 100;
                            })
                            .attr("class", "circle")
                            .attr("fill", (d, i) => {
                                if (i == 0) {
                                    return "#ffd700";
                                }
                                else if (i == 1) {
                                    return "#ff8c00";
                                }
                                else if (i == 2) {
                                    return "#ff0000";
                                }
                            })

                        if (j == 1) {
                            setTimeout(function() {
                                svg.selectAll("line"+city_no+city_list)
                                    .data(dataset1)
                                    .enter()
                                    .append("line")
                                    .attr("x1", (d) => {
                                        return (city_no * 116) + 100 + dataset[citylist[i] + "_" + 0][0] / 100;
                                    })
                                    .attr("x2", (d) => {
                                        return (city_no * 116) + 100 + dataset[citylist[i] + "_" + 1][0] / 100;
                                    })
                                    .attr("y1", (d, i) => {
                                        return 480;
                                    })
                                    .attr("y2", (d, i) => {
                                        return 320;
                                    })
                                    .style("stroke-dasharray", ("7,10"))
                                    .attr("stroke", "black")
                                    .attr("stroke-width", 0.1)

                                svg.selectAll("line"+city_no+city_list)
                                    .data(dataset1)
                                    .enter()
                                    .append("line")
                                    .attr("x1", (d) => {
                                        return (city_no * 116) + 100 - dataset[citylist[i] + "_" + 0][0] / 100;
                                    })
                                    .attr("y1", (d, i) => {
                                        return 480;
                                    })
                                    .attr("x2", (d) => {
                                        return (city_no * 116) + 100 - dataset[citylist[i] + "_" + 1][0] / 100;
                                    })
                                    .attr("y2", (d, i) => {
                                        return 320;
                                    })
                                    .style("stroke-dasharray", ("7,10"))
                                    .attr("stroke", "black")
                                    .attr("stroke-width", 0.1)
                            }, 1500);
                        }
                        if (j == 2) {
                            setTimeout(function() {
                                svg.selectAll("line"+city_no+city_list)
                                    .data(dataset1)
                                    .enter()
                                    .append("line")
                                    .attr("x1", (d) => {
                                        return (city_no * 116) + 100 + dataset[citylist[i] + "_" + 1][0] / 100;
                                    })
                                    .attr("y1", (d, i) => {
                                        return 320;
                                    })
                                    .attr("x2", (d) => {
                                        return (city_no * 116) + 100 + dataset[citylist[i] + "_" + 2][0] / 100;
                                    })
                                    .attr("y2", (d, i) => {
                                        return 160;
                                    })
                                    .style("stroke-dasharray", ("7,10"))
                                    .attr("stroke", "black")
                                    .attr("stroke-width", 0.1)

                                svg.selectAll("line"+city_no+city_list)
                                    .data(dataset1)
                                    .enter()
                                    .append("line")
                                    .attr("x1", (d) => {
                                        return (city_no * 116) + 100 - dataset[citylist[i] + "_" + 1][0] / 100;
                                    })
                                    .attr("y1", (d, i) => {
                                        return 320;
                                    })
                                    .attr("x2", (d) => {
                                        return (city_no * 116) + 100 - dataset[citylist[i] + "_" + 2][0] / 100;
                                    })
                                    .attr("y2", (d, i) => {
                                        return 160;
                                    })
                                    .style("stroke-dasharray", ("7,10"))
                                    .attr("stroke", "black")
                                    .attr("stroke-width", 0.1)
                            }, 1500);
                        }


                    }, j * 1500);

                }
            }

            let xScale = d3.scalePoint()
                .domain(citylist)
                .range([0, width - 34]);

            let yScale = d3.scalePoint()
                .domain(["2020", "2050", "2080"])
                .range([height - 80, 160]);

            let legendScale = d3.scalePoint()
                .domain(["0", "1,500", "3,000"])
                .range([3, 70]);

            let xAxis = d3.axisBottom()
                .scale(xScale)
                .ticks(10)

            let yAxis = d3.axisLeft()
                .scale(yScale)
                .ticks(3)

            let legendAxis = d3.axisLeft()
                .scale(legendScale)
                .ticks(3)

            svg.append("g")
                .attr("class", "axis1")
                .attr("transform", "translate(" + 98 + "," + (height - 10) + ")")
                .call(xAxis)

            svg.append("g")
                .attr("class", "axis2")
                .attr("transform", "translate(" + 50 + ",0)")
                .call(yAxis)

            svg.append("g")
                .attr("class", "axis3")
                .attr("transform", "translate(" + 880 + ",0)")
                .call(legendAxis)

            svg.append("g")
                .append("text")
                .text("Legend")
                .attr("class", "scale")
                .attr("x", 775)
                .attr("y", 40)

            svg.append("circle")
                .attr("cx", 925)
                .attr("cy", 35)
                .attr("r", 35)
                .attr("fill", "#ffd700")

            svg.append("circle")
                .attr("cx", 925)
                .attr("cy", 35)
                .attr("r", 25)
                .attr("fill", "#ff8c00")

            svg.append("circle")
                .attr("cx", 925)
                .attr("cy", 35)
                .attr("r", 15)
                .attr("fill", "#ff0000")

            svg.append("rect")
                .attr("class", "legend_square")
                .attr("width", 10)
                .attr("height", 10)
                .attr("x", 965)
                .attr("y", 12)
                .style("fill", "#ffd700")

            svg.append("text")
                .text("Extreme caution (heat index 33-39°C)")
                .attr("class", "legend")
                .attr("x", 980)
                .attr("y", 22);

            svg.append("rect")
                .attr("class", "legend_square")
                .attr("width", 10)
                .attr("height", 10)
                .attr("x", 965)
                .attr("y", 30)
                .style("fill", "#ff8c00")

            svg.append("text")
                .text("Danger (heat index 40-51°C)")
                .attr("class", "legend")
                .attr("x", 980)
                .attr("y", 40);

            svg.append("rect")
                .attr("class", "legend_square")
                .attr("width", 10)
                .attr("height", 10)
                .attr("x", 965)
                .attr("y", 48)
                .style("fill", "#ff0000")

            svg.append("text")
                .text("Extreme danger (heat index 51>°C)")
                .attr("class", "legend")
                .attr("x", 980)
                .attr("y", 58);

            svg.append("text")
                .text("hours")
                .attr("class", "legend2")
                .attr("x", 885)
                .attr("y", 74)
                .attr("font-size", "10px")

        });
}