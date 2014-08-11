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

    $scope.state = $base64.encode(angular.toJson('{}'));
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
