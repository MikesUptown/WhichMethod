'use strict';

angular.module('contraceptionApp')
  .directive('survey', function () {
    return {
      template: '<div></div>',
      restrict: 'EA',
      link: function (scope, element, attrs) {
        element.text('this is the survey directive');

        // PUT GENERAL JS CODE FOR PAGE HERE


      }
    };
  });