'use strict';

angular.module('contraceptionApp')
  .controller('SettingsCtrl', function ($scope, User, Auth) {
    $scope.errors = {};
    $scope.user = {};

    $scope.currentUser = Auth.getCurrentUser();

    $scope.signUp = function(form){
      $scope.submitted = true;

      if(form.$valid) {
        Auth.registerGuest({
          name: $scope.user.name,
          email: $scope.user.email,
          password: $scope.user.password,
          // oldpassword: 'guest'
        })
        .then( function() {
          // Account created, redirect to home
          // $location.path('/questions/intro/1');
          $scope.message = 'Thank you for registering.';
        })
        .catch( function(err) {
          err = err.data;
          $scope.errors = {};

          // Update validity of form fields that match the mongoose errors
          angular.forEach(err.errors, function(error, field) {
            form[field].$setValidity('mongoose', false);
            $scope.errors[field] = error.message;
          });
        });
      }
    }

    $scope.changePassword = function(form) {
      $scope.submitted = true;
      if(form.$valid) {
        Auth.changePassword( "guest", $scope.user.newPassword )
        .then( function() {
          $scope.message = 'Password successfully changed.';
        })
        .catch( function() {
          form.password.$setValidity('mongoose', false);
          $scope.errors.other = 'Incorrect password';
          $scope.message = '';
        });
      }
		};
  });
