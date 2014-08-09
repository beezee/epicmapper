'use strict';

/* jasmine specs for services go here */

describe('EpicRepo', function() {
  beforeEach(module('epicMapper.services'));


  describe('epics()', function() {
    it('should return an array of epics', inject(function(EpicRepo) {
      expect(EpicRepo.epics()).toEqual(['a', 'b']);
    }));
  });
});

