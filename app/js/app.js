'use strict';

// Declare app level module which depends on filters, and services
var anacoment = angular.module('anacoment', ['ana.filters', 'ana.services', 'ana.directives', 'ana.controllers'])

anacoment.config(['$routeProvider', function($routeProvider) {
		$routeProvider.when('/general', {templateUrl: 'partials/general.html', controller: 'generalCtrl'});
		$routeProvider.when('/totalStat', {templateUrl: 'partials/totalStat.html', controller: 'totalStatCtrl'});
		$routeProvider.when('/dayStat', {templateUrl: 'partials/dayStat.html', controller: 'dayStatCtrl'});
		$routeProvider.when('/circularHeat', {templateUrl: 'partials/circularHeat.html', controller: 'circularHeatCtrl'});
    $routeProvider.otherwise({redirectTo: '/general'});
  }]);
