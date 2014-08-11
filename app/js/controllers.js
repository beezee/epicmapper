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

    $scope.state = $base64.encode(angular.toJson('{bw:10, events:[]}'));
    ngUrlBind($scope, 'state');

    var epicSettings = function() {
      return _.chain($scope.epicData.epicRepo.epics)
        .filter(function(e) { return Epic.withSettings(e).target() >= moment().startOf('day'); })
        .map(function(e) { return Epic.withSettings(e).toEvent(); })
        .value();
    };

    $scope.addEpic = function() {
      if (_.contains(_.pluck($scope.epicData.epicRepo.epics, 'title'), 
            $scope.epicData.editingEvent.title)
          || !(Epic.withSettings($scope.epicData.editingEvent)
                .isValid()))
          return;
      $scope.epicData.epicRepo.epics.push($scope.epicData.editingEvent);
      delete $scope.epicData.editingEvent.isNew;
    };

    $scope.removeEpic = function() {
      var index = _.findIndex($scope.epicData.epicRepo.epics,
        function(e) { return e == $scope.epicData.editingEvent; });
      $scope.epicData.epicRepo.epics.splice(index, 1);
      $scope.epicData.editingEvent = {isNew: true};
    };

    $scope.currentState = function() {
      return {bw: $scope.epicData.dailyBandwidth,
         events: epicSettings()};
    };

    $scope.savedState = function() {
      return $base64.decode($scope.state);
    };

    $scope.hasUnsavedChanges = function() {
      return angular.toJson($scope.currentState()) != $scope.savedState();
    };

    $scope.saveState = function() {
      $scope.state = $base64.encode(angular.toJson($scope.currentState()));
    };

    $scope.epicData.epicRepo = EpicRepo.initializeFromEvents(angular.fromJson($scope.savedState())['events']);
    $scope.epicData.dailyBandwidth = angular.fromJson($scope.savedState())['bw'] || 10;

  }]);
