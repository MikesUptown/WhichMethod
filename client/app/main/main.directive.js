'use strict';

angular.module('contraceptionApp')
  .directive('main', function () {
    return {
      link: function (scope, element, attrs) {
        // element.text('this is the main directive');

        // PUT JS HERE


      }
    };
  })

angular.module('contraceptionApp')
  .directive('lang', function () {
    return {
      link: function (scope, element, attrs) {
        if(attrs.lang != scope.language)
          element.hide()
        else
          element.show()
        // element.text('this is the main directive');

        // PUT JS HERE


      }
    };
  })



  // .directive('fullscreen', function () {
  //   return {
  //     link: function (scope, element, attrs) {

  //       element.height( $(window).height() )
  //       // PUT JS HERE

  //     }
  //   };
  // });