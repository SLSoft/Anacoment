'use strict';

/* Directives */

var directives = angular.module('ana.directives', []);

directives.directive('appVersion', ['version', function(version) {
	return function(scope, elm, attrs) {
		elm.text(version);
	};
}]);

directives.directive('rtIp', function(){
	return function(scope, elm, attrs) {
		setInterval(function(){scope.ip = scope.ip + 1;}, 1000);
	};
});

directives.directive('rtPv', function(){
	return function(scope, elm, attrs) {
		setInterval(function(){scope.pv = scope.pv + 1;}, 1000);
	};
});

directives.directive('rtUv', function(){
	return function(scope, elm, attrs) {
		setInterval(function(){scope.uv = scope.uv + 1;}, 1000);
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