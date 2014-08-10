'use strict';

/* Controllers */

angular.module('epicMapper.controllers', [])
  .controller('epicMapperController', ['$scope', 'EpicRepo', function($scope, EpicRepo) {
    
    $scope.epicData = {};
    $scope.epicData.epicRepo = EpicRepo.initializeFromEvents([
      {title: '1', start: '2014-08-01', end: '2014-08-03', cost: 20},
      {title: '2', start: '2014-08-05', end: '2014-08-12', cost: 30},
      {title: '3', start: '2014-08-04', end: '2014-08-07', cost: 10}
    ]);
  }]);
