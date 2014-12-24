'use strict';

angular.module('contraceptionApp')
  .controller('LoginCtrl', function ($scope, Auth, $location, $state) {
    $scope.user = {};
    $scope.errors = {};

    $scope.login = function(form) {
      $scope.submitted = true;

      if(form.$valid) {
        Auth.login({
          email: $scope.user.email,
          password: $scope.user.password
        })
        .then( function(user) {
          // Logged in, redirect to home
          if($scope.user.email=="admin")
            $location.path('/admin');
          else{


          Auth.getCurrentUser().$promise.then(function(u){

            var section = u.currentSection
            if(section == undefined)
              $location.url('/questions/intro/1')
            else{
              $state.go('sections.questions', {type:'question',id:section})
            }


          })            

            // var section = user.currentSection
            // if(section == undefined)
            //   $location.url('/questions/intro/1')
            // else{
            //   $state.go('sections.questions', {type:'question',id:section})
            // }

            // $location.path('/questions/section/1');
          }
        })
        .catch( function(err) {
          $scope.errors.other = err.message;
        });
      }
    };

  });
