'use strict';

/* jasmine specs for services go here */

describe('Epic', function() {
  beforeEach(module('epicMapper.services'));
  var settings = { title: 't', start: '2014-01-01', end: '2014-01-03', cost: 20 };

  describe('withSettings', function() {
    it('applies only relevant settings and returns a new instance of an Epic', inject(function(Epic) {
      var irrelevantSettings = _.clone(settings);
      irrelevantSettings.costPerDay = 'foo';
      expect(Epic.withSettings(irrelevantSettings).settings).toEqual(settings);
    }));

    it('uses start date if no end date provided', inject(function(Epic) {
      var oneDaySettings = _.clone(settings);
      oneDaySettings.end = null;
      var expectedSettings = _.clone(oneDaySettings);
      expectedSettings.end = expectedSettings.start;
      expect(Epic.withSettings(oneDaySettings).settings).toEqual(expectedSettings);
    }));
  });

  describe('toEvent()', function() {
    it('should return a correct hash for use in a calendar', inject(function(Epic) {
      var expectedEvent = _.clone(settings);
      expectedEvent.costPerDay = (20/3);
      expectedEvent.start = moment(expectedEvent.start).toDate();
      expectedEvent.end = moment(expectedEvent.end).toDate();
      expect(Epic.withSettings(settings).toEvent()).toEqual(expectedEvent);
    }));
  });

  describe('duration()', function() {
    it('should correctly calculate and return epic duration in days', inject(function(Epic) {
      expect(Epic.withSettings(settings).duration()).toEqual(3);
    }));

    it('should exclude weekends from duration calculation', inject(function(Epic) {
      var settings = { title: 't', start: '2014-08-08', end: '2014-08-11', cost: 20 };
      expect(Epic.withSettings(settings).duration()).toEqual(2);
    }));
  });

  describe('costPerDay()', function() {
    it('should correctly calculate and return cost per day, assuming even weighting', inject(function(Epic) {
      expect(Epic.withSettings(settings).costPerDay()).toEqual((20/3));
    }));
  });

  describe('isValid()', function() {
    var invalidSettings = {};
    var epic;
    beforeEach(function() {
      invalidSettings = _.clone(settings);
    });
      
    it('rejects settings with invalid or missing start date', inject(function(Epic) {
      invalidSettings.start = 'thing';
      expect(Epic.withSettings(invalidSettings).isValid()).toBe(false);
      delete invalidSettings.start;
      expect(Epic.withSettings(invalidSettings).isValid()).toBe(false);
    }));

    it('rejects settings with invalid end date', inject(function(Epic) {
      invalidSettings.end = 'thing';
      expect(Epic.withSettings(invalidSettings).isValid()).toBe(false);
      delete invalidSettings.end;
      expect(Epic.withSettings(invalidSettings).isValid()).toBe(true);
    }));

    it('rejects settings with invalid or missing cost', inject(function(Epic) {
      invalidSettings.cost = 'thing';
      expect(Epic.withSettings(invalidSettings).isValid()).toBe(false);
      delete invalidSettings.cost;
      expect(Epic.withSettings(invalidSettings).isValid()).toBe(false);
    }));

    it('rejects settings with invalid or missing title', inject(function(Epic) {
      invalidSettings.title = 4;
      expect(Epic.withSettings(invalidSettings).isValid()).toBe(false);
      invalidSettings.title = '';
      expect(Epic.withSettings(invalidSettings).isValid()).toBe(false);
      delete invalidSettings.title;
      expect(Epic.withSettings(invalidSettings).isValid()).toBe(false);
    }));
  });
});


