'use strict';

/* Controllers */

angular.module('epicMapper.controllers', [])
  .controller('epicMapperController', 
    ['$scope', 'EpicRepo', 'ngUrlBind', '$base64', 
      function($scope, EpicRepo, ngUrlBind, $base64) {
    
    $scope.epicData = {};
    $scope.epicData.editingEvent = {isNew: true};

    $scope.isWeekend = function(date, mode) {
      return _.contains([6, 7], moment(date).isoWeekday());
    };

    $scope.dummyEvents = [
      {title: '1', start: '2014-08-01', end: '2014-08-03', cost: 20},
      {title: '2', start: '2014-08-05', end: '2014-08-12', cost: 30},
      {title: '3', start: '2014-08-04', end: '2014-08-07', cost: 10}
    ];

    $scope.state = $base64.encode(angular.toJson($scope.dummyEvents));
    ngUrlBind($scope, 'state');

    var epicSettings = function() {
      return _.map($scope.epicData.epicRepo.epics(), function(e) { return e.settings; });
    };

    $scope.savedState = function() {
      return $base64.decode($scope.state);
    };

    $scope.hasUnsavedChanges = function() {
      return angular.toJson(epicSettings()) != $scope.savedState();
    };

    $scope.saveState = function() {
      $scope.state = $base64.encode(angular.toJson(epicSettings()));
    };

    $scope.epicData.epicRepo = EpicRepo.initializeFromEvents(angular.fromJson($scope.savedState()));

  }]);
