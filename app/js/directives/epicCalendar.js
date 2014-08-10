'use strict';

angular.module('epicMapper.directives')
  .directive('epicCalendar', ['EpicRepo', '$compile', '$timeout', function(EpicRepo, $compile, $timeout) {
    return {
      restrict: 'A',
      scope: {
        data: '=epicData'
      },
      link: function(scope, element, attrs) {
        scope.eventSources = [_.map(scope.data.epicRepo.epics(), function(e) { return e.toEvent(); })];

        var costForDay = function(day) {
          var epics = scope.data.epicRepo.epicsSpanningDate(day);
          return _.chain(epics).map(function(e) { return e.costPerDay(); })
            .reduce(function(sum, num) { return sum + num; });
        };

        var editEvent = function(event, allDay, jsEvent, view) {
          scope.data.editingEvent = event;
        };

        // absurd hack
        // angular sees these the current event being equal to 
        // the new one, so no $digest is triggered on the
        // parent scope for the epic editor
        // re-assigning the values does not work either, 
        // but for some reason this does
        var refreshEditingEvent = function(event) {
            editEvent({title: event.title});
            $timeout(function() { editEvent(event); }, 100);
        };

        var refreshCalendar = function(event, jsEvent, ui, view) {
          scope.data.epicRepo = EpicRepo.initializeFromEvents(scope.eventSources[0]);
          if (event && scope.data.editingEvent)
            refreshEditingEvent(event);
          if (scope.ec && scope.ec.fullCalendar)
            scope.ec.fullCalendar('render');
        };

        var renderEvent = function(event, element) {
          var eventText = event.title;
          var epic = scope.data.epicRepo.assignedEpics[event.title];
          eventText += ' - Target: ' + moment(event.end).format('MM/DD/YYYY');
          eventText += ' Cost Per Day: ' + Math.ceil(epic.costPerDay());
          element.find('.fc-event-title').text(eventText);
        };

        scope.calendarConfig = {
          height: 450,
          editable: true,
          weekends: false,
          header:{
            left: 'month',
            center: 'title',
            right: 'prev,next'
          },
          eventClick: editEvent,
          eventDragStop: refreshCalendar,
          eventResizeStop: refreshCalendar,
          eventRender: renderEvent,
          dayRender: function(date, element, view) {
            var daysCost = costForDay(date);
            if (!daysCost || isNaN(daysCost)) return;
            element.prepend('<span class="hours-per-day">'+Math.ceil(daysCost)+'</span>');    
          },
        };

        scope.$watchCollection(
          '[data.editingEvent.cost, data.editingEvent.start, data.editingEvent.end]', 
          function() { refreshCalendar(); });

        element.html('<div><div ui-calendar="calendarConfig" config="calendarConfig" '
          + 'ng-model="eventSources" calendar="ec"></div></div>')
        $compile(element.contents())(scope);
      }
    };
  }]);
