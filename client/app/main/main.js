'use strict';

angular.module('contraceptionApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('main', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      });
  });

//   function CarouselDemoCtrl($scope) {
//   $scope.myInterval = 5000;
//   var slides = $scope.slides = [];
//   $scope.addSlide = function() {
//     var newWidth = 600 + slides.length;
//     slides.push({
//       image: 'http://placekitten.com/' + newWidth + '/300',
//       text: ['More','Extra','Lots of','Surplus'][slides.length % 4] + ' ' +
//         ['Cats', 'Kittys', 'Felines', 'Cutes'][slides.length % 4]
//     });
//   };
//   for (var i=0; i<4; i++) {
//     $scope.addSlide();
//   }
// }

    // // <!-- Bootstrap core JavaScript
    // // ================================================== -->
    // // <!-- Placed at the end of the document so the pages load faster -->
    // <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
    // <script src="../../dist/js/bootstrap.min.js"></script>
    // <script src="../../assets/js/docs.min.js"></script>
    // // <!-- IE10 viewport hack for Surface/desktop Windows 8 bug -->
    // <script src="../../assets/js/ie10-viewport-bug-workaround.js"></script>