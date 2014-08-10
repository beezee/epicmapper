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

        var refreshCalendar = function(event, jsEvent, ui, view) {
          scope.data.epicRepo = EpicRepo.initializeFromEvents(scope.eventSources[0]);
          if (event && scope.data.editingEvent) {
            // absurd hack
            // angular sees these the current event being equal to 
            // the new one, so no $digest is triggered on the
            // parent scope for the epic editor
            // re-assigning the values does not work either, 
            // but for some reason this does
            editEvent({title: event.title});
            $timeout(function() { editEvent(event); }, 100);
          }
          if (scope.ec && scope.ec.fullCalendar)
            scope.ec.fullCalendar('render');
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
          dayRender: function(date, element, view) {
            var daysCost = costForDay(date);
            if (!daysCost || isNaN(daysCost)) return;
            element.prepend('<span class="hours-per-day">'+Math.ceil(daysCost)+'</span>');    
          },
        };

        scope.$watch('data.editingEvent.cost', function() { refreshCalendar(); });

        element.html('<div><div ui-calendar="calendarConfig" config="calendarConfig" '
          + 'ng-model="eventSources" calendar="ec"></div></div>')
        $compile(element.contents())(scope);
      }
    };
  }]);
