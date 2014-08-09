'use strict';

angular.module('epicMapper.services')
  .service('Epic', [function() {
 
    var epic = function() {};

    epic.withSettings = function(settings) {
      var epicInstance = new epic();
      epicInstance.settings = settings
      return epicInstance;
    };

    epic.prototype.toEvent = function() {
      var eventHash = _.clone(this.settings);
      eventHash.costPerDay = this.costPerDay();
      return eventHash;
    };

    epic.prototype.duration = function() {
      return (moment(this.settings.end).diff(moment(this.settings.start), 'days') + 1);
    };

    epic.prototype.costPerDay = function() {
      return this.settings.cost / this.duration();
    };

    return epic;
  }]);

