//
// Configuration
//

// ms to wait after dragging before auto-rotating
var rotationDelay = 1500;
// scale of the globe (not the canvas element)
var scaleFactor = 0.9;
// autorotation speed
var degPerSec = 6;
// start angles
var angles = { x: -20, y: 40, z: 0 };
// colors
var colorWater = "#4C86A8";
var colorLand = "#BDC696";
var colorGraticule = "#ccc";
var colorCountry = "#a00";

//
// Handler
//
console.log("Starting...");

function enter(country) {
  var country = countryList.find(function (c) {
    return parseInt(c.id, 10) === parseInt(country.id, 10);
  });
  current.text(
    "NAME: " +
      (country && country.name) +
      // " " +
      // (country && country.Urban_population) +
      "" || ""
  );
  // makeHistogram(country);
}

function makeHistogram(country) {
  // set the dimensions and margins of the graph
  var margin = { top: 10, right: 30, bottom: 30, left: 40 },
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  var svg = d3.select("svg > g");

  if(svg.empty()){
    // svg = d3.select(this).append("svg:svg").attr("width", width)
    //         .attr("height", height)
    //         .append("svg:g")
    //         .attr("transform", "translate(" + (width - r) / 2 + "," + (height - r) / 2 + ")");
    var svg = d3
    .select("#my_dataviz")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
}

  // var svg = d3
  //   .select("#my_dataviz")
  //   .append("svg")
  //   .attr("width", width + margin.left + margin.right)
  //   .attr("height", height + margin.top + margin.bottom)
  //   .append("g")
  //   .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // get the data
  d3.csv(
  "https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/1_OneNum.csv",
  function (data) {
  // X axis: scale and draw:

  // console.log({ data });
  var my_data = country.Urban_population
  // console.log({my_data})
  var trans_data = my_data.map(function (e) {
    return {"price": e.toString()}
  })
  var data = trans_data
  // var my_data = country.Urban_population.map(function (e) {
  //   return { value: e };
  // });
  // console.log({my_data})
  // console.log({ trans_data });
  // console.log({ data });

  var x = d3
    .scaleLinear()
    // .domain([0, 1000]) // can use this instead of 1000 to have the max of data: d3.max(data, function(d) { return +d.price })
    .domain([0, d3.max(data, function(d) { return +d.price })]) // can use this instead of 1000 to have the max of data: 
    .range([0, width]);
  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // set the parameters for the histogram
  var histogram = d3
    .histogram()
    .value(function (d) {
      return d.price;
      // return d.value;
    }) // I need to give the vector of value
    .domain(x.domain()) // then the domain of the graphic
    .thresholds(x.ticks(data.length / 4 | 0)); // then the numbers of bins

  // And apply this function to data to get the bins
  var bins = histogram(data);

  // Y axis: scale and draw:
  var y = d3.scaleLinear().range([height, 0]);
  y.domain([
    0,
    d3.max(bins, function (d) {
      return d.length;
    }),
  ]); // d3.hist has to be called before the Y axis obviously
  svg.append("g").call(d3.axisLeft(y));

  // append the bar rectangles to the svg element
  svg
    .selectAll("rect")
    .data(bins)
    .enter()
    .append("rect")
    .attr("x", 1)
    .attr("transform", function (d) {
      return "translate(" + x(d.x0) + "," + y(d.length) + ")";
    })
    .attr("width", function (d) {
      return x(d.x1) - x(d.x0) - 1;
    })
    .attr("height", function (d) {
      return height - y(d.length);
    })
    .style("fill", "#69b3a2");
  }
  );
}

function leave(country) {
  current.text("");
  // clearHist();
}

function clearHist() {
  d3
    .select("#my_dataviz")
    .select("svg")
    .remove();
}

//
// Variables
//

// var hist = d3.select("#my_dataviz")
var current = d3.select("#current");
var canvas = d3.select("#globe");
var canvas2 = d3.select("#box");
var canvas3 = d3.select("#info");
var context = canvas.node().getContext("2d");
var water = { type: "Sphere" };
var projection = d3.geoOrthographic().precision(0.1);
var graticule = d3.geoGraticule10();
var path = d3.geoPath(projection).context(context);
var v0; // Mouse position in Cartesian coordinates at start of drag gesture.
var r0; // Projection rotation as Euler angles at start.
var q0; // Projection rotation as versor at start.
var lastTime = d3.now();
var degPerMs = degPerSec / 1000;
var width, height;
var width2, height2;
var land, countries;
var countryList;
var autorotate, now, diff, roation;
var currentCountry;

//
// Functions
//

function setAngles() {
  var rotation = projection.rotate();
  rotation[0] = angles.y;
  rotation[1] = angles.x;
  rotation[2] = angles.z;
  projection.rotate(rotation);
}

function scale() {
  width = document.documentElement.clientWidth * 0.5;
  height = document.documentElement.clientHeight;
  canvas.attr("width", width).attr("height", height);
  projection
    .scale((scaleFactor * Math.min(width, height)) / 2)
    .translate([width / 2, height / 2]);

  width2 = document.documentElement.clientWidth * 0.49;
  height2 = document.documentElement.clientHeight * 0.7;
  canvas3.attr("width", width2).attr("height", height2);
  canvas3.style("background-color", "#ff000030");
  // var svg = canvas3.append("svg").attr("width", width2).attr("height", height2).style("position", "absolute").style("bottom", 0);
  canvas3
    .append("rect")
    .attr("x", 10)
    .attr("y", 10)
    .attr("width", 40)
    .attr("height", 40)
    .attr("stroke", "black")
    .attr("fill", "#ffffff");
  render();
}

function startRotation(delay) {
  autorotate.restart(rotate, delay || 0);
}

function stopRotation() {
  autorotate.stop();
}

function dragstarted() {
  v0 = versor.cartesian(projection.invert(d3.mouse(this)));
  r0 = projection.rotate();
  q0 = versor(r0);
  stopRotation();
}

function dragged() {
  var v1 = versor.cartesian(projection.rotate(r0).invert(d3.mouse(this)));
  var q1 = versor.multiply(q0, versor.delta(v0, v1));
  var r1 = versor.rotation(q1);
  projection.rotate(r1);
  render();
}

function dragended() {
  startRotation(rotationDelay);
}

function render() {
  context.clearRect(0, 0, width, height);
  fill(water, colorWater);
  stroke(graticule, colorGraticule);
  fill(land, colorLand);
  if (currentCountry) {
    fill(currentCountry, colorCountry);
  }
}

function fill(obj, color) {
  context.beginPath();
  path(obj);
  context.fillStyle = color;
  context.fill();
}

function stroke(obj, color) {
  context.beginPath();
  path(obj);
  context.strokeStyle = color;
  context.stroke();
}

function rotate(elapsed) {
  now = d3.now();
  diff = now - lastTime;
  if (diff < elapsed) {
    rotation = projection.rotate();
    rotation[0] += diff * degPerMs;
    projection.rotate(rotation);
    render();
  }
  lastTime = now;
}

function loadData(cb) {
  d3.json("110m.json", function (error, world) {
    if (error) throw error;
    d3.tsv("my_data.tsv", function (error, countries) {
      if (error) throw error;
      cb(world, countries);
    });
  });
}

// https://github.com/d3/d3-polygon
function polygonContains(polygon, point) {
  var n = polygon.length;
  var p = polygon[n - 1];
  var x = point[0],
    y = point[1];
  var x0 = p[0],
    y0 = p[1];
  var x1, y1;
  var inside = false;
  for (var i = 0; i < n; ++i) {
    (p = polygon[i]), (x1 = p[0]), (y1 = p[1]);
    if (y1 > y !== y0 > y && x < ((x0 - x1) * (y - y1)) / (y0 - y1) + x1)
      inside = !inside;
    (x0 = x1), (y0 = y1);
  }
  return inside;
}

function mousemove() {
  var c = getCountry(this);
  if (!c) {
    if (currentCountry) {
      leave(currentCountry);
      currentCountry = undefined;
      render();
    }
    return;
  }
  if (c === currentCountry) {
    return;
  }
  currentCountry = c;
  render();
  enter(c);
}

function selectOnClick() {
  var cp = getCountry(this);
  console.log("selectOnClick");
  // console.log({ cp });

  // console.log({countryList})
  var country = countryList.find(function (c) {
    // console.log({c})
    return parseInt(c.id, 10) === parseInt(cp.id, 10);
  });

  // console.log({country})

  clearHist();
  makeHistogram(country);
}

function getCountry(event) {
  var pos = projection.invert(d3.mouse(event));
  return countries.features.find(function (f) {
    return f.geometry.coordinates.find(function (c1) {
      return (
        polygonContains(c1, pos) ||
        c1.find(function (c2) {
          return polygonContains(c2, pos);
        })
      );
    });
  });
}

//
// Initialization
//

console.log("Initialization");

setAngles();

canvas
  .call(
    d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended)
  )
  .on("mousemove", mousemove)
  .on("click", selectOnClick);

// canvas.on("onclick", selectOnClick)

loadData(function (world, cList) {
  land = topojson.feature(world, world.objects.land);
  countries = topojson.feature(world, world.objects.countries);
  countryList = cList;
  for (c in cList) {
    c_ = cList[c];
    for (v in c_) {
      if (c_[v] != undefined && !["id", "name"].includes(v)) {
        // console.log(`${v}: ${c_[v]}`)
        var str_val = c_[v];
        var my_list = str_val.split(",");
        my_list = my_list.map(function (x) {
          return parseInt(x.trim());
        });
        c_[v] = my_list;
        // console.log(`${v}: ${my_list.length}`)
      }
    }
  }
  // console.log({ countryList });

  window.addEventListener("resize", scale);
  scale();
  autorotate = d3.timer(rotate);
});
