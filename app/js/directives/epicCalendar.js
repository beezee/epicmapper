'use strict';

angular.module('epicMapper.directives')
  .directive('epicCalendar', ['EpicRepo', 'Epic', '$compile', '$timeout', function(EpicRepo, Epic, $compile, $timeout) {
    return {
      restrict: 'A',
      scope: {
        data: '=epicData'
      },
      link: function(scope, element, attrs) {
        
        scope.data.eventSources = [scope.data.epicRepo.epics];

        var costForDay = function(day) {
          var epics = scope.data.epicRepo.epicsSpanningDate(day);
          return _.chain(epics).map(function(e) { return Math.ceil(Epic.withSettings(e).costPerDay()); })
            .reduce(function(sum, num) { return sum + num; })
            .value();
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
          if (event && scope.data.editingEvent)
            refreshEditingEvent(event);
          if (scope.ec && scope.ec.fullCalendar)
            scope.ec.fullCalendar('render');
        };

        var renderEvent = function(event, element) {
          var eventText = event.title;
          var epic = Epic.withSettings(event);
          eventText += ' - Target: ' + epic.target().format('MM/DD/YYYY');
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
            element.prepend('<span class="badge badge-xs hours-per-day">$'+daysCost+'</span>');    
          },
        };

        element.html('<div><div ui-calendar="calendarConfig" config="calendarConfig" '
          + 'ng-model="data.eventSources" calendar="ec"></div></div>')
        $compile(element.contents())(scope);
      }
    };
  }]);
