'use strict';

/* Directives */

var directives = angular.module('myApp.directives', []);

directives.
  directive('mySimpleSvg', function() {
    return function(scope, element, attr) {
      return {
        restrict: 'AEC',
        scope: {
        
        },
        link: function (scope, element, attr) {
          elem[0].append('svg');
        }
      };
    };
  });

directives.
  directive('myLineGraph', function() {
    return function(scope, element, attr) {
      return {
        restrict: 'E', // Directive Scope is element
        scope: {
          data: '=',
        },
        link: function (scope, elem, attrs) {
          var margin = {top: 20, right: 20, bottom: 30, left: 50},
            width = 960 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

          var parseDate = d3.time.format("%d-%b-%y").parse;

          var x = d3.time.scale()
              .range([0, width]);

          var y = d3.scale.linear()
              .range([height, 0]);

          var xAxis = d3.svg.axis()
              .scale(x)
              .orient("bottom");

          var yAxis = d3.svg.axis()
              .scale(y)
              .orient("left");

          var line = d3.svg.line()
              .x(function(d) { return x(d.date); })
              .y(function(d) { return y(d.close); });

          var svg = d3.select("#"+elem[0].id).append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
            .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

          d3.tsv("data.tsv", function(error, data) {
            data.forEach(function(d) {
              d.date = parseDate(d.date);
              d.close = +d.close;
            });

            x.domain(d3.extent(data, function(d) { return d.date; }));
            y.domain(d3.extent(data, function(d) { return d.close; }));

            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis);

            svg.append("g")
                .attr("class", "y axis")
                .call(yAxis)
              .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text("Price ($)");

            svg.append("path")
                .datum(data)
                .attr("class", "line")
                .attr("d", line);
          });
        }
      };
    };
  });

directives.
  directive('angulard3BarGraph', function () { // Angular Directive
        return {
            restrict: 'A', // Directive Scope is Attribute
            scope: {
                datajson: '=',
                xaxisName: '=',
                xaxisPos: '=',
                yaxisName: '=',
                yaxisPos: '=',
                d3Format: '='
                // All the Angular Directive Vaiables used as d3.js parameters
            },
            link: function (scope, elem, attrs) {
                // The d3.js code for generation of bar graph. further reading should be done from http://d3js.org/
                var margin = {top: 20, right: 20, bottom: 30, left: 40},
                    width = 960 - margin.left - margin.right,
                    height = 500 - margin.top - margin.bottom;

                var formatPercent = d3.format(scope.d3Format); // formatting via angular variable

                var x = d3.scale.ordinal()
                       .rangeRoundBands([0, width], .1);

               var y = d3.scale.linear()
                       .range([height, 0]);

               var xAxis = d3.svg.axis()
                       .scale(x)
                       .orient("bottom");

               var yAxis = d3.svg.axis()
                       .scale(y)
                       .orient("left")
                       .tickFormat(formatPercent);

               var svg = d3.select("#"+elem[0].id).append("svg") // selecting the DOM element by d3.js 
                                                                 // - getting from Angular context   
                   .attr("width", width + margin.left + margin.right)
                   .attr("height", height + margin.top + margin.bottom)
                   .append("g")
                       .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

              d3.json(scope.datajson, function(error, data) { // external data filename- angular directive variable
                  if (error) return console.warn(error);

                  x.domain(data.map(function(d) { return d.letter; }));
                  y.domain([0, d3.max(data, function(d) { return d.frequency; })]);

                  svg.append("g")
                      .attr("class", "x axis")
                      .attr("transform", "translate(0," + height + ")")
                      .call(xAxis)
                      .append("text")
                          .attr("x", scope.xaxisPos)
                          .attr("dx", ".71em")
                          .style("text-anchor", "end")
                          .text(scope.xaxisName);
                  // x axis legend setting from angular variables
                  svg.append("g")
                      .attr("class", "y axis")
                      .call(yAxis)
                      .append("text")
                          .attr("transform", "rotate(-90)")
                          .attr("y", scope.yaxisPos)
                          .attr("dy", ".71em")
                          .style("text-anchor", "end")
                          .text(scope.yaxisName);
                  // y axis legend setting from angular variables
                  svg.selectAll(".bar")
                      .data(data)
                      .enter().append("rect")
                      .attr("class", "bar")
                      .attr("x", function(d) { return x(d.letter); })
                      .attr("width", x.rangeBand())
                      .attr("y", function(d) { return y(d.frequency); })
                      .attr("height", function(d) { return height - y(d.frequency); });
                  });
              }
           }
       });
  
directives.
  directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }]);
  
  
