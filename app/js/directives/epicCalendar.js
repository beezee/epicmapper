'use strict';

angular.module('epicMapper.directives')
  .directive('epicCalendar', ['EpicRepo', '$compile', function(EpicRepo, $compile) {
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

        var refreshCalendar = function(event, jsEvent, ui, view) {
          scope.data.epicRepo = EpicRepo.initializeFromEvents(scope.eventSources[0]);
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
          eventDragStop: refreshCalendar,
          eventResizeStop: refreshCalendar,
          dayRender: function(date, element, view) {
            var daysCost = costForDay(date);
            if (!daysCost || isNaN(daysCost)) return;
            element.prepend('<span class="hours-per-day">'+Math.ceil(daysCost)+'</span>');    
          },
        };
        element.html('<div><div ui-calendar="calendarConfig" config="calendarConfig" '
          + 'ng-model="eventSources" calendar="ec"></div></div>')
        $compile(element.contents())(scope);
      }
    };
  }]);
