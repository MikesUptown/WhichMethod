'use strict';

angular.module('contraceptionApp')
  .controller('LoginCtrl', function ($scope, Auth, $location) {
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
          else
            $location.path('/questions/section/1');
        })
        .catch( function(err) {
          $scope.errors.other = err.message;
        });
      }
    };

  });
