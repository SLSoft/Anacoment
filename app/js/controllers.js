'use strict';

/* Controllers */

angular.module('ana.controllers', []).
  controller('generalCtrl', ['$scope', function($scope) {
  $scope.dayStat = {ip: 5422, pv: 2311, uv: 3604};

  //每日的基本统计数据
  setInterval(function(){
    $scope.dayStat.ip = $scope.dayStat.ip + 1;
    $scope.dayStat.pv = $scope.dayStat.pv + 1;
    $scope.dayStat.uv = $scope.dayStat.uv + 1;

    $scope.$apply();
  }, 1000)

  //各类统计数据总览
  //性别比例、页面排行、访问深度、全部来源
  $scope.summaryStat = {
    sex: {man: 21, woman: 33, other: 9},
    pageRank: [{url: "www.google.com", hits: 100}, {url: "www.google.com", hits: 100}]
  }; 
}])
.controller('totalStatCtrl', ['$scope', function($scope){
}])
.controller('circularHeatCtrl',['$scope', function($scope){
}])
.controller('dayStatCtrl',['$scope', function($scope){
}]);
