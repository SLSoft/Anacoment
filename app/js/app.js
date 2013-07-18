'use strict';

// Declare app level module which depends on filters, and services
var anacoment = angular.module('anacoment', ['ana.filters', 'ana.services', 'ana.directives', 'ana.controllers'])

anacoment.config(['$routeProvider', function($routeProvider) {
		$routeProvider.when('/dayStat', {templateUrl: 'partials/dayStat.html', controller: 'dayStatCtrl'});
		$routeProvider.when('/circularHeat', {templateUrl: 'partials/circularHeat.html', controller: 'circularHeatCtrl'});
    $routeProvider.when('/view1', {templateUrl: 'partials/partial1.html', controller: 'MyCtrl1'});
    $routeProvider.when('/view2', {templateUrl: 'partials/partial2.html', controller: 'MyCtrl2'});
    $routeProvider.otherwise({redirectTo: '/view1'});
  }]);
