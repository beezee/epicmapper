'use strict';

angular.module('epicMapper.services')
  .service('EpicRepo', ['Epic', function(Epic) {
    var epicRepo = function() {};

    epicRepo.prototype.assignedEpics = [];

    epicRepo.prototype.initializeFromEvents = function(events) {
      var repo = new epicRepo();
      repo.assignedEpics = _.chain(events)
        .map(function(e) { return Epic.withSettings(e); })
        .filter(function(e) { return e.constructor == Epic && e.isValid(); }).value();
      return repo;
    };

    epicRepo.prototype.epics = function() {
      return this.assignedEpics;
    };

    epicRepo.prototype.epicsSpanningDate = function(date) {
      var targetDate = moment(date);
      return _.filter(this.epics(), function(e) {
        return moment(e.settings.start).startOf('day') <= targetDate.startOf('day')
          && targetDate.startOf('day') <= moment(e.settings.end).endOf('day');
      });
    };
    
    return new epicRepo();
  }]);
