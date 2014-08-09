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
      expect(repo.epics().length).toEqual(1);
      expect(repo.epics()[0].settings).toEqual(events[1]);
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

    it('accepts either date or string', function() {
      var epics = repo.epicsSpanningDate('2014-01-01');
      expect(epics.length).toEqual(1);
      expect(epics[0].settings).toEqual(events[0]);
      epics = repo.epicsSpanningDate(moment('2014-01-05').toDate());
      expect(epics.length).toEqual(1);
      expect(epics[0].settings).toEqual(events[2]);
    });

    it('returns the correct epics', function() {
      var epicSettings = function(e) { return e.settings; };
      var epics = repo.epicsSpanningDate('2014-01-02');
      expect(_.map(epics, epicSettings)).toEqual(events.slice(0, 2));
      var epics = repo.epicsSpanningDate('2014-01-04');
      expect(_.map(epics, epicSettings)).toEqual(events.slice(1, 3));
    });

  });
});

