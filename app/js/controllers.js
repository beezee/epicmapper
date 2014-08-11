'use strict';

/* Controllers */

angular.module('epicMapper.controllers', [])
  .controller('epicMapperController', 
    ['$scope', 'Epic', 'EpicRepo', 'ngUrlBind', '$base64', 
      function($scope, Epic, EpicRepo, ngUrlBind, $base64) {
    
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
      return _.chain($scope.epicData.epicRepo.epics)
        .filter(function(e) { return Epic.withSettings(e).target() >= moment().startOf('day'); })
        .map(function(e) { return Epic.withSettings(e).toEvent(); })
        .value();
    };

    $scope.addEpic = function() {
      if (_.contains(_.pluck($scope.epicData.epicRepo.epics, 'title'), 
            $scope.epicData.editingEvent.title))
          return;
      $scope.epicData.epicRepo.epics.push($scope.epicData.editingEvent);
      delete $scope.epicData.editingEvent.isNew;
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
