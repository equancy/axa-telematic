/* Graph définition */
var width = 800,
    height = 800,
    radius = Math.min(width, height) / 2 - 30;

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var r = function (d) {
    return Math.sqrt(d[0] * d[0] + d[1] * d[1]);
}

var angle = function (d) {
    return Math.atan2(d[1], d[0]);
}

var gAngle = svg.append("g")
    .attr("class", "a axis")
    .selectAll("g")
    .data(d3.range(0, 360, 45))
    .enter().append("g")
    .attr("transform", function (d) {
        return "rotate(" + -d + ")";
    });


gAngle.append("text")
    .attr("x", radius + 6)
    .attr("dy", ".35em")
    .style("text-anchor", function (d) {
        return d < 270 && d > 90 ? "end" : null;
    })
    .attr("transform", function (d) {
        return d < 270 && d > 90 ? "rotate(180 " + (radius + 6) + ",0)" : null;
    })
    .text(function (d) {
        return d + "°";
    });

gAngle.append("line")
    .attr("x2", radius);

var rAxis = svg.append("g")
    .attr("class", "r axis");

var paths = svg.append("g")
    .attr("class", "drivers-paths");

var update = function (data) {
    var max = d3.max(data, function (item) {
        return d3.max(item, function (subitem) {
            return r(subitem);
        });
    });

    if (max == undefined) max = 1000

    var rScale = d3.scale.linear()
        .domain([0, max])
        .range([0, radius]);

    /* Axis */
    var gRadius = rAxis.selectAll("g circle")
        .data(rScale.ticks(5).slice(1));

    gRadius
        .transition()
        .duration(750)
        .attr("r", rScale);

    gRadius.enter()//.append("g")
        .append('circle')
        .attr("r", rScale);

    gRadius.exit()
        .transition()
        .duration(750)
        .attr("r", 0)
        .remove();

    var gRadiusText = rAxis.selectAll("text")
        .data(rScale.ticks(5).slice(1));

    gRadiusText
        .transition()
        .duration(750)
        .attr("y", function (d) {
            return -rScale(d) - 4;
        })
        .text(function (d) {
            return d;
        });

    gRadiusText.enter().append("text")
        .attr("y", function (d) {
            return -rScale(d) - 4;
        })
        .attr("transform", "rotate(15)")
        .style("text-anchor", "middle")
        .text(function (d) {
            return d;
        });

    gRadiusText.exit()
        .transition()
        .duration(750)
        .attr("y", function (d) {
            return -rScale(d) - 4;
        })
        .remove();

    var colorScale = d3.scale.linear()
        .domain([0, max])
        .range(["#3498db", "#e74c3c"]);

    var line = d3.svg.line.radial()
        .radius(function (d) {
            return rScale(r(d));
        })
        .angle(function (d) {
            return angle(d);
        });

    var driversPaths = paths.selectAll("path")
        .data(data);

    driversPaths
        .attr("stroke", function (d) {
            return colorScale(d3.max(d, function (item) {
                return r(item);
            }));
        })
        .transition()
        .delay(750)
        .attr("d", function (d) {
            return line(d);
        })

    driversPaths.enter().append("path")
        .attr("class", "line")
        .attr("stroke-width", "1.5")
        .attr("stroke", function (d) {
            return colorScale(d3.max(d, function (item) {
                return r(item);
            }));
        })
        .attr("fill", "none")
        .transition()
        .delay(750)
        .attr("d", function (d) {
            return line(d);
        });

    driversPaths.exit().remove();
}

var drawDriver = function (id) {
    d3.json("data/" + parseInt(id), function (d) {
        update(d.results);
    }, function (error, rows) {
        console.log(rows);
    });
}

update([]);
drawDriver(1);


