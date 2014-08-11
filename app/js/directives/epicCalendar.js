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
          if (event && Epic.withSettings(event).isValid() && scope.data.editingEvent)
            refreshEditingEvent(event);
          if (scope.ec && scope.ec.fullCalendar)
            scope.ec.fullCalendar('render');
        };

        var renderEvent = function(event, element) {
          var eventText = event.title;
          var epic = Epic.withSettings(event);
          eventText += ' - Target: ' + epic.target().format('MM/DD/YYYY');
          eventText += ' - Cost Per Day: ' + Math.ceil(epic.costPerDay());
          element.find('.fc-event-title').text(eventText);
        };

        var dayThresholdClass = function(daysCost) {
          var diff = daysCost - scope.data.dailyBandwidth;
          if (diff <= -2)
            return 'label-success';
          if (diff >= 2)
            return 'label-danger';
          return 'label-info';
        };

        var renderDay = function(date, element, view) {
          var daysCost = costForDay(date);
          if (!daysCost || isNaN(daysCost)) return;
          var label = $('<span class="label label-xs hours-per-day">$'+daysCost+'</span>');    
          label.addClass(dayThresholdClass(daysCost));
          element.prepend(label); 
        };

        scope.calendarConfig = {
          height: 450,
          editable: true,
          weekends: false,
          header:{
            left: '',
            center: 'title',
            right: 'prev,next'
          },
          eventClick: editEvent,
          eventDragStop: refreshCalendar,
          eventResizeStop: refreshCalendar,
          eventRender: renderEvent,
          dayRender: renderDay
        };

        scope.$watch(
          function() { 
            return scope.data.epicRepo.epics.length; 
          }, 
          refreshCalendar
        );

        scope.$watchCollection(
          '[data.editingEvent.cost, data.editingEvent.start, ' +
          'data.editingEvent.end]', 
          function() { refreshCalendar(); })

        element.html('<div><div ui-calendar="calendarConfig" config="calendarConfig" '
          + 'ng-model="data.eventSources" calendar="ec"></div></div>')
        $compile(element.contents())(scope);
      }
    };
  }]);
