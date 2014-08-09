'use strict';

angular.module('epicMapper.services')
  .service('EpicRepo', [function() {
    var epicRepo = function() {};

    epicRepo.prototype.epics = function() {
      return ['a', 'b'];
    };
    
    return new epicRepo();
  }]);
