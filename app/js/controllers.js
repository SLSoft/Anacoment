'use strict';

/* Controllers */

angular.module('ana.controllers', []).
  controller('generalCtrl', ['$scope', function($scope) {
  	$scope.ip = 5422;
  	$scope.pv = 2311;
  	$scope.uv = 3604;

  	setInterval(function(scope){scope.pv += 1; alert(scope.pv);}($scope), 1000);

  }])
  .controller('circularHeatCtrl',['$scope', function($scope){
  }])
  .controller('dayStatCtrl',['$scope', function($scope){
  }]);