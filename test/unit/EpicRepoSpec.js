'use strict';

/* jasmine specs for services go here */

describe('EpicRepo', function() {
  beforeEach(module('epicMapper.services'));

  describe('initializeFromEvents()', function() {
    
    it('takes an array of event hashes and populates repo epics for all valid hashes', 
        inject(function(EpicRepo, Epic) {
      var events = [{title: 'invalid'}, 
                {title: 't', start: '2014-01-01', end: '2014-01-03', cost: 20}];
      var repo = EpicRepo.initializeFromEvents(events);
      expect(repo.epics.length).toEqual(1);
      expect(repo.epics[0]).toEqual(Epic.withSettings(events[1]).toEvent());
    }));
  });

  describe('epicsSpanningDate(date)', function() {
    var events, repo = null;

    beforeEach(inject(function(EpicRepo) {
      events = [{title: '1', start: '2014-01-01', end: '2014-01-03', cost: 20},
                {title: '2', start: '2014-01-02', end: '2014-01-04', cost: 20},
                {title: '3', start: '2014-01-03', end: '2014-01-05', cost: 20}];
      repo = EpicRepo.initializeFromEvents(events);
    }));

    it('accepts either date or string', inject(function(Epic) {
      var epics = repo.epicsSpanningDate('2014-01-01');
      expect(epics.length).toEqual(1);
      expect(epics[0]).toEqual(Epic.withSettings(events[0]).toEvent());
      epics = repo.epicsSpanningDate(moment('2014-01-05').toDate());
      expect(epics.length).toEqual(1);
      expect(epics[0]).toEqual(Epic.withSettings(events[2]).toEvent());
    }));

    it('returns the correct epics', inject(function(Epic) {
      var toEpicEvent = function(e) { return Epic.withSettings(e).toEvent(); };
      var epics = repo.epicsSpanningDate('2014-01-02');
      expect(epics).toEqual(_.map(events.slice(0, 2), toEpicEvent));
      var epics = repo.epicsSpanningDate('2014-01-04');
      expect(epics).toEqual(_.map(events.slice(1, 3), toEpicEvent));
    }));

  });
});

