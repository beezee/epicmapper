'use strict';

angular.module('epicMapper.services')
  .service('Epic', [function() {
 
    var epic = function() {};

    epic.withSettings = function(settings) {
      var epicInstance = new epic();
      epicInstance.settings = _.pick(settings, 'title', 'start', 'end', 'cost');
      if (!epicInstance.settings.end)
        epicInstance.settings.end = epicInstance.settings.start; 
      return epicInstance;
    };

    epic.prototype.toEvent = function() {
      var eventHash = _.clone(this.settings);
      eventHash.costPerDay = this.costPerDay();
      eventHash.start = moment(eventHash.start).toDate();
      eventHash.end = moment(eventHash.end).toDate();
      return eventHash;
    };

    epic.prototype.duration = function() {
      return (moment(this.settings.end).businessDiff(moment(this.settings.start), 'days') + 1);
    };

    epic.prototype.costPerDay = function() {
      return this.settings.cost / this.duration();
    };

    epic.prototype.settings = {};

    epic.prototype.isValid = function() {
      if (!this.settings.start) return false;
      if (!moment(this.settings.start).isValid()) return false;
      if (!moment(this.settings.end).isValid()) return false;
      if (this.settings.cost === '' || isNaN(this.settings.cost)) return false;
      if (this.settings.title === '' || (typeof this.settings.title) !== 'string') return false;
      return true;
    };

    return epic;
  }]);

