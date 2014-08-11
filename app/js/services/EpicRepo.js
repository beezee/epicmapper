'use strict';

angular.module('epicMapper.services')
  .service('EpicRepo', ['Epic', function(Epic) {
    var epicRepo = function() {};

    epicRepo.prototype.epics = [];

    epicRepo.prototype.initializeFromEvents = function(events) {
      var repo = new epicRepo();
      var distinctAssignedEpics = _.chain(events)
        .map(function(e) { return Epic.withSettings(e); })
        .filter(function(e) { return e.constructor == Epic && e.isValid(); })
        .map(function(e) { return e.toEvent(); })
        .indexBy(function(e) { return e.title; }).value();
      repo.epics = _.values(distinctAssignedEpics);
      return repo;
    };

    epicRepo.prototype.epicsSpanningDate = function(date) {
      var targetDate = moment(date);
      return _.filter(this.epics, function(e) {
        return moment(e.start).startOf('day') <= targetDate.startOf('day')
          && targetDate.startOf('day') <= moment(
            Epic.withSettings(e).target()).endOf('day');
      });
    };
    
    return new epicRepo();
  }]);
