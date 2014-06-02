'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
  .controller('MyCtrl1', ['$scope', '$http', function($scope, $http) {
    $http.get('data/population.json').success(function(data) {
      $scope.population = data;
    });
  }])
  .controller('MyCtrl2', ['$scope', function($scope) {

  }]);
