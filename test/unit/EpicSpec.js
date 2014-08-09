'use strict';

/* jasmine specs for services go here */

describe('Epic', function() {
  beforeEach(module('epicMapper.services'));
  var settings = { title: 't', start: '2014-01-01', end: '2014-01-03', cost: 20 };

  describe('toEvent()', function() {
    it('should return a correct hash for use in a calendar', inject(function(Epic) {
      var expectedSettings = _.clone(settings);
      expectedSettings.costPerDay = (20/3);
      expect(Epic.withSettings(settings).toEvent()).toEqual(expectedSettings);
    }));
  });

  describe('duration()', function() {
    it('should correctly calculate and return epic duration in days', inject(function(Epic) {
      expect(Epic.withSettings(settings).duration()).toEqual(3);
    }));
  });

  describe('costPerDay()', function() {
    it('should correctly calculate and return cost per day, assuming even weighting', inject(function(Epic) {
      expect(Epic.withSettings(settings).costPerDay()).toEqual((20/3));
    }));
  });

  describe('isValid()', function() {

  });
});


