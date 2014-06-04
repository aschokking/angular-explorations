//Width and height
var w = 600;
var h = 300;
var padding = 50;

function generateRandomNumber() {
  var xRange = Math.random() * 25;	//Max range of new x values
  return { key:keyCount++, value: Math.floor(Math.random() * xRange) + 1};
}

var keyCount = 0;

function generateRandomDataSet() {
  var dataset = [];					//Initialize empty array
  var numDataPoints = 20;				//Number of dummy data points to create
  
  for (var i = 0; i < numDataPoints; i++) {					//Loop numDataPoints times
    dataset.push(generateRandomNumber());					//Add new number to array
  }
  return dataset;
}

function drawBar() {
  var dataset = generateRandomDataSet();
  
  //dataset = [1, 10, 20, 30, 40, 50, 60, 70, 80, 100];
  
  var barPadding = 2;
  
  var key = function(d) { return d.key; }
  var value = function(d) { return d.value; }
  
  var xScale = d3.scale
    .ordinal()
    .domain(d3.range(dataset.length))
    .rangeRoundBands([0, w - 2 * padding],  0.1);
    
  var yScale = d3.scale
    .linear()
    .domain([0, d3.max(dataset, value)])
    .range([0, h - 2 * padding]);
    
  var yScaleI = d3.scale
    .linear()
    .domain([0, d3.max(dataset, value)])
    .range([h - padding, padding]);

  var colorYScale = d3.scale
    .linear()
    .domain([0, d3.max(dataset, value)])
    .rangeRound([0, 255]);
    
  var yAxis = d3.svg.axis()
    .scale(yScaleI)
    .orient("left");
    
  var svg = d3.select("body").append("svg").attr({
    height: h,
    width: w,
    });
    
  var axis = svg.append("g")
    .attr("transform", "translate(" + padding + ",0)")
    .call(yAxis);
    
  var barsRoot = svg.append("g");
  var bars = barsRoot.selectAll("rect").data(dataset, key).enter()
    .append("rect")
    .attr({
      height: function(d) { return yScale(d.value) },
      width: function() { return xScale.rangeBand() },
      x: function(d, i) { return xScale(i) + padding; },
      y: function(d) { return h - yScale(d.value) - padding; },
      fill: function(d) { return "rgb(0,0," + colorYScale(d.value) + ")"; }
    });
    
  var labelsRoot = svg.append("g");
  var labels = labelsRoot.selectAll("text").data(dataset, key).enter()
    .append("text")
    .text(function (d) {return d.value;})
    .attr({
      x: function(d, i) { return xScale(i) + 0.5 * xScale.rangeBand() + padding; },
      y: function(d) { return h - yScale(d.value) + 20 - padding;},
      fill: "white",
      "font-size" : "11pt",
      "text-anchor": "middle"
    });
   
   barsRoot.selectAll("rect").on("click", function(d) {
    // find that element in the dataset and remove it
    var index = dataset.indexOf(d);
    dataset.splice(index, 1);
    recomputePositions();
   });
   
    function recomputePositions() {
      xScale.domain(d3.range(dataset.length));
        
      yScale.domain([0, d3.max(dataset, value)]);
        
      yScaleI.domain([0, d3.max(dataset, value)]);

      colorYScale.domain([0, d3.max(dataset, value)]);
      //Select…
      var bars = barsRoot.selectAll("rect")
						.data(dataset, key);
      bars
        .enter()
        .append("rect")
        .attr({
          height: function(d) { return yScale(d.value) },
          width: function() { return xScale.rangeBand() },
          x: function(d, i) { return xScale(i) + 3 * padding; },
          y: function(d) { return h - yScale(d.value) - padding; },
          fill: function(d) { return "rgb(0,0," + colorYScale(d.value) + ")"; }
        });
 
      bars
        .transition()
        .delay(function (d, i) { return i * 25; })
        .duration(500)
        .attr({
          height: function(d) { return yScale(d.value) },
          y: function(d) { return h - yScale(d.value) - padding; },
          x: function(d, i) { return xScale(i) + padding; },
          width: function() { return xScale.rangeBand() },
          fill: function(d) { return "rgb(0,0," + colorYScale(d.value) + ")"; }
        });
        
      bars
        .exit()
        .transition()
        .duration(500)
        .attr({
          y: function(d, i) { return 0; }
        })
        .style("opacity", 0)
        .remove();
        
      var labels = labelsRoot.selectAll("text").data(dataset, key);
       
      labels
        .enter()
        .append("text")
        .text(function (d) {return d.value;})
        .attr({
          x: function(d, i) { return xScale(i) + 0.5 * xScale.rangeBand() + 3 * padding; },
          y: function(d) { return h - yScale(d.value) + 20 - padding;},
          fill: "white",
          "font-size" : "11pt",
          "text-anchor": "middle"
        });
       
      labels
        .text(function (d) {return d.value;})
        .transition()
        .delay(function (d, i) { return i * 25; })
        .duration(500)
        .attr({
          x: function(d, i) { return xScale(i) + 0.5 * xScale.rangeBand() + padding; },
          y: function(d) { return h - yScale(d.value) + 20 - padding;},
        });
        
      labels
        .exit()
        .remove();
        
      axis.transition().delay(200).duration(750).call(yAxis);
      
      svg.selectAll("rect").on("click", function(d) {
        // find that element in the dataset and remove it
        var index = dataset.indexOf(d);
        dataset.splice(index, 1);
        recomputePositions();
       });
    };
    
  d3.select("#shuffle")
    .on("click", function() {
      dataset = generateRandomDataSet();
      
      recomputePositions();
      
    });
    
  d3.select("#add")
    .on("click", function() {
      dataset.push(generateRandomNumber());					//Add new number to array
      recomputePositions();
    });
}

function drawScatter() {

  
  /*
  //Static dataset
  var dataset = [
          [5, 20], [480, 90], [250, 50], [100, 33], [330, 95],
          [410, 12], [475, 44], [25, 67], [85, 21], [220, 88],
          [600, 150]
          ];
  */
  
  //Dynamic, random dataset
  var dataset = [];					//Initialize empty array
  var numDataPoints = 50;				//Number of dummy data points to create
  var xRange = Math.random() * 1000;	//Max range of new x values
  var yRange = Math.random() * 1000;	//Max range of new y values
  for (var i = 0; i < numDataPoints; i++) {					//Loop numDataPoints times
    var newNumber1 = Math.floor(Math.random() * xRange);	//New random integer
    var newNumber2 = Math.floor(Math.random() * yRange);	//New random integer
    dataset.push([newNumber1, newNumber2]);					//Add new number to array
  }

  //Create scale functions
  var xScale = d3.scale.linear()
             .domain([0, d3.max(dataset, function(d) { return d[0]; })])
             .range([padding, w - padding * 2]);

  var yScale = d3.scale.linear()
             .domain([0, d3.max(dataset, function(d) { return d[1]; })])
             .range([h - padding, padding]);

  var rScale = d3.scale.linear()
             .domain([0, d3.max(dataset, function(d) { return d[1]; })])
             .range([2, 5]);

  //Define X axis
  var xAxis = d3.svg.axis()
            .scale(xScale)
            .orient("bottom")
            .ticks(5);

  //Define Y axis
  var yAxis = d3.svg.axis()
            .scale(yScale)
            .orient("left")
            .ticks(5);

  //Create SVG element
  var svg = d3.select("body")
        .append("svg")
        .attr("width", w)
        .attr("height", h);

  //Create circles
  svg.selectAll("circle")
     .data(dataset)
     .enter()
     .append("circle")
     .attr("cx", function(d) {
        return xScale(d[0]);
     })
     .attr("cy", function(d) {
        return yScale(d[1]);
     })
     .attr("r", function(d) {
        return rScale(d[1]);
     });
  
  //Create X axis
  svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + (h - padding) + ")")
    .call(xAxis);
  
  //Create Y axis
  svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(" + padding + ",0)")
    .call(yAxis);
}