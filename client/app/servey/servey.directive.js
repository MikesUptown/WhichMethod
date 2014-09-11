'use strict';

angular.module('contraceptionApp')
  .directive('servey', function () {
    return {
      template: '<div></div>',
      restrict: 'EA',
      link: function (scope, element, attrs) {
        element.text('this is the servey directive');

        // PUT GENERAL JS CODE FOR PAGE HERE


      }
    };
  });