'use strict';

/* Directives */

var directives = angular.module('ana.directives', []);

directives.directive('appVersion', ['version', function(version) {
  return function(scope, elm, attrs) {
    elm.text(version);
  };
}]);

directives.directive('totalStat', function(){
  return function(scope, elm, attrs) {
    var monthlyBubbleChart = dc.bubbleChart("#monthly-bubble-chart");

    d3.csv("data/d_event.csv", function(data){ 
      var dateFormat = d3.time.format("%y%m%d");
      var numberFormat = d3.format(".2f");

      data.forEach(function(e){
        e.dd = dateFormat.parse(e.date);
        e.month = d3.time.month(e.dd);
      }); 

      var ndx = crossfilter(data);
      var all = ndx.groupAll();

      //创建各类数据维度
      var dateDimension = ndx.dimension(function(d){
        return d.dd;
      });

      var monthDimension = ndx.dimension(function(d){
        return d.month;
      });

      //创建各类辅助函数
      var quarter = ndx.dimension(function (d) {
        var month = d.dd.getMonth();
        if (month <= 3)
          return "Q1";
        else if (month > 3 && month <= 5)
          return "Q2";
        else if (month > 5 && month <= 7)
          return "Q3";
        else
          return "Q4";
      });
      var dayOfWeek = ndx.dimension(function (d) {
        var day = d.dd.getDay();
        switch (day) {
          case 0:
            return "0.Sun";
          case 1:
            return "1.Mon";
          case 2:
            return "2.Tue";
          case 3:
            return "3.Wed";
          case 4:
            return "4.Thu";
          case 5:
            return "5.Fri";
          case 6:
            return "6.Sat";
        }
      });

      //创建数据图

      var monthGroupWithNum = monthDimension.group().reduce(        
        //add
        function (p, v) {
          ++p.count;
          p.date = v.month;
          p.absGain += +v.num;
          p.fluctuation += Math.abs(+v.num);
          p.sumIndex += (+v.num) / 2;
          p.avgIndex = p.sumIndex / p.count;
          p.percentageGain = (p.absGain / p.avgIndex) * 100;
          p.fluctuationPercentage = (p.fluctuation / p.avgIndex) * 100;
          return p;
        },
        //remove
        function (p, v) {
          --p.count;
          p.date = v.month;
          p.absGain -= +v.num;
          p.fluctuation -= Math.abs(+v.num);
          p.sumIndex -= (+v.num) / 2;
          p.avgIndex = p.sumIndex / p.count;
          p.percentageGain = (p.absGain / p.avgIndex) * 100;
          p.fluctuationPercentage = (p.fluctuation / p.avgIndex) * 100;
          return p;
        },
        //init
        function () {
          return {count: 0, date: "2012-5-1", absGain: 0, fluctuation: 0, fluctuationPercentage: 0, sumIndex: 0, avgIndex: 0, percentageGain: 0};
        }
      );

      monthlyBubbleChart.width(990)
      .height(250)
      .margins({top: 10, right: 50, bottom: 30, left: 40})
      .dimension(monthDimension)
      .group(monthGroupWithNum)
      .transitionDuration(1500)
      .colors(["#a60000", "#ff0000", "#ff4040", "#ff7373", "#67e667", "#39e639", "#00cc00"])
      .keyAccessor(function (p) {
        return p.date;
      })
      .valueAccessor(function (p) {
        return p.value.percentageGain;
      })
      .radiusValueAccessor(function (p) {
        return p.value.fluctuationPercentage;
      }) 
      .maxBubbleRelativeSize(0.3)
      .x(d3.time.scale().domain([new Date(2012, 8, 1), new Date(2013, 5, 31)]))
      .y(d3.scale.linear().domain([1, 20000]))
      .r(d3.scale.linear().domain([1, 20000]))
      .elasticY(true)
      .yAxisPadding(100)
      .elasticX(true)
      .xAxisPadding(500)
      .renderHorizontalGridLines(true)
      .renderVerticalGridLines(true)
      .renderLabel(true)
      .renderTitle(true)
      .label(function (p) {
        return p.key.getFullYear();
      });

      var volumeByMonth = ndx.dimension(function(d) { return d3.time.month(d.dd); });
      var volumeByMonthGroup = volumeByMonth.group()
      .reduceSum(function(d) { return d.num; });

      dc.barChart("#" + attrs.id )
      .width(990) // (optional) define chart width, :default = 200
      .height(250) // (optional) define chart height, :default = 200
      .transitionDuration(500) // (optional) define chart transition duration, :default = 500
      // (optional) define margins
      .margins({top: 10, right: 50, bottom: 30, left: 40})
      .dimension(volumeByMonth) // set dimension
      .group(volumeByMonthGroup) // set group
      // (optional) whether chart should rescale y axis to fit data, :default = false
      .elasticY(true)
      // (optional) when elasticY is on whether padding should be applied to y axis domain, :default=0
      .yAxisPadding(100)
      // (optional) whether chart should rescale x axis to fit data, :default = false
      .elasticX(true)
      // (optional) when elasticX is on whether padding should be applied to x axis domain, :default=0
      .xAxisPadding(500)
      // define x scale
      .x(d3.time.scale().domain([new Date(2012, 8, 1), new Date(2013, 5, 31)]))
      // (optional) set filter brush rounding
      .round(d3.time.month.round)
      // define x axis units
      .xUnits(d3.time.months)
      // (optional) whether bar should be center to its x value, :default=false
      .centerBar(true)
      // (optional) set gap between bars manually in px, :default=2
      .gap(1)
      // (optional) render horizontal grid lines, :default=false
      .renderHorizontalGridLines(true)
      // (optional) render vertical grid lines, :default=false
      .renderVerticalGridLines(true)
      .title(function(d) { return "Value: " + d.value; })
      // (optional) whether chart should render titles, :default = false
      .renderTitle(true);

      var dayOfWeekGroup = dayOfWeek.group().reduceSum(function(d){return d.num});
      dc.rowChart("#days-of-week-chart").width(180)
      .height(180)
      .margins({top: 20, left: 10, right: 10, bottom: 20})
      .group(dayOfWeekGroup)
      .dimension(dayOfWeek)
      .colors(['#3182bd', '#6baed6', '#9ecae1', '#c6dbef', '#dadaeb'])
      .label(function (d){
        return d.key.split(".")[1];
      })
      .title(function(d){return d.value;})
      .elasticX(true)
      .xAxis().ticks(4);
      
      dc.renderAll();
    }); 

  };
});


directives.directive('dayStat', function(){
  return function(scope, element, attrs, ctrl) {
    var context_margin = {top: 10, right: 10, bottom: 100, left: 40},
    focus_margin = {top: 430, right: 10, bottom: 20, left: 40},
    svg_w = 960,
    svg_h = 500;

    var width = svg_w - context_margin.left - context_margin.right,
    context_height = svg_h - context_margin.top - context_margin.bottom,
    focus_height = svg_h - focus_margin.top - focus_margin.bottom;

    var parseDate = d3.time.format("%y%m%d").parse;

    var context_scale_x = d3.time.scale().range([0, width]),
    context_scale_y = d3.scale.linear().range([context_height, 0]);

    var focus_scale_x = d3.time.scale().range([0, width]),
    focus_scale_y = d3.scale.linear().range([focus_height, 0]);

    var context_axis_x = d3.svg.axis().scale(context_scale_x).orient("bottom"),
    focus_axis_x = d3.svg.axis().scale(focus_scale_x).orient("bottom"),
    context_axis_y = d3.svg.axis().scale(context_scale_y).orient("left");

    var brush = d3.svg.brush()
    .x(focus_scale_x)
    .on("brush", brushed);

    var context_area = d3.svg.area()
    .interpolate("monotone")
    .x(function(d) {return context_scale_x(d.date);})
    .y0(context_height)
    .y1(function(d) {return context_scale_y(d.num);})

    var focus_area = d3.svg.area()
    .interpolate("monotone")
    .x(function(d) {return focus_scale_x(d.date);})
    .y0(focus_height)
    .y1(function(d) {return focus_scale_y(d.num);})

    var line = d3.svg.line()
    .interpolate("monotone")
    .x(function(d) {return context_scale_x(d.date);})
    .y(function(d) {return context_scale_y(d.num);});

    var svg = d3.select("#" + attrs.id)
    .append("svg")
    .attr("width", svg_w)
    .attr("height", svg_h);

    svg.append("defs").append("clipPath")
    .attr("id", "clip")
    .append("rect")
    .attr("width", width)
    .attr("height", context_height);

    var context = svg.append("g")
    .attr("transform", "translate(" + context_margin.left + "," + context_margin.top + ")");

    var focus = svg.append("g")
    .attr("transform", "translate(" + focus_margin.left + "," + focus_margin.top + ")");

    d3.csv("data/d_event.csv", function(error, data){

      data.forEach(function(d){
        d.date = parseDate(d.date);
        d.num = +d.num;
      });

      context_scale_x.domain(d3.extent(data, function(d) { return d.date; }));
      context_scale_y.domain([1,d3.max(data, function(d) { return d.num; })]);
      focus_scale_x.domain(d3.extent(data, function(d) { return d.date; }));
      focus_scale_y.domain([1,d3.max(data, function(d) { return d.num; })]);

      context.append("path")
      .datum(data)
      .attr("clip-path", "url(#clip)")
      .attr("d", context_area);

      context.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + context_height + ")")
      .call(context_axis_x);

      context.append("g")
      .attr("class", "y axis")
      .call(context_axis_y);

      focus.append("path")
      .datum(data)
      .attr("d", focus_area);

      focus.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + focus_height + ")")
      .call(focus_axis_x);

      focus.append("g")
      .attr("class", "x brush")
      .call(brush)
      .selectAll("rect")
      .attr("y", -6)
      .attr("height", focus_height + 7);

    });

    function brushed() {
      context_scale_x.domain(brush.empty() ? focus_scale_x.domain() : brush.extent());
      context.select("path").attr("d", context_area);
      context.select(".x.axis").call(context_axis_x);
    }
  }
});

directives.directive("circularHeat", function(){
  return function(scope, element, attrs) {
    var chart = circularHeatChart()
    .innerRadius(20)
    .range(["#eee", "steelblue"])
    .radialLabels(["周一", "周二", "周三", "周四", "周五", "周六", "周日"])
    .segmentLabels(["12", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10",
                   "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"]);

                   d3.text("data/w_and_t.txt", function(error, data){

                     data = data.split(',');
                     d3.select("#" + attrs.id)
                     .selectAll('svg')
                     .data([data])
                     .enter()
                     .append('svg')
                     .call(chart);
                   });
  };
})
