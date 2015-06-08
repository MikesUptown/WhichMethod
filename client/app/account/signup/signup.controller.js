'use strict';

angular.module('contraceptionApp')
  .controller('SignupCtrl', function ($scope, Auth, $location,$rootScope) {
    $scope.user = {};
    $scope.errors = {};
    $rootScope.consent1 = false;
    $rootScope.consent2 = false;

    if(!$rootScope.consent){
      $location.path('/privacy').replace();
    }

    if($rootScope.consent == "option1")
      $rootScope.consent1 = true
    else if($rootScope.consent == "option2")
      $rootScope.consent2 = true

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
        consent1: $rootScope.consent1,
        consent2: $rootScope.consent2,
        zip:999,
      })
      .then( function() {
        // Account created, redirect to home
        $location.path('/questions/intro/1');
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
          zip: $scope.user.zip,
          consent1: $rootScope.consent1,
          consent2: $rootScope.consent2,
        })
        .then( function(user) {
          // Account created, redirect to home
          $location.path('/questions/intro/1');
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
