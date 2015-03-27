'use strict';

angular.module('contraceptionApp')
  .controller('SignupCtrl', function ($scope, Auth, $location) {
    $scope.user = {};
    $scope.errors = {};

    function randomString(length) {
      var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
      var result = '';
      for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
      return result;
    }

    $scope.guestSignin = function(){

      var name = 'guest'
      var rnd = randomString(5)
      var email = rnd + '@guest.com'
      var pass = 'guest'

      Auth.createUser({
        name: name,
        email: email,
        password: pass,
        zip:999,
      })
      .then( function() {
        // Account created, redirect to home
        $location.path('/questions/intro/0');
      })
      .catch( function(err) {
        err = err.data;
        $scope.errors = {};
        console.log(err)
      })

    }

    $scope.register = function(form) {
      $scope.submitted = true;

      if(form.$valid) {
        Auth.createUser({
          name: $scope.user.name,
          email: $scope.user.email,
          password: $scope.user.password,
          zip: $scope.user.zip
        })
        .then( function() {
          // Account created, redirect to home
          $location.path('/questions/intro/0');
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
    };

  });
