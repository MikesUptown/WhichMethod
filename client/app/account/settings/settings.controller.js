'use strict';

angular.module('contraceptionApp')
  .controller('SettingsCtrl', function ($scope, User, Auth, $location, $state) {
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
          // zip:$scope.user.zip,
          // oldpassword: 'guest'
        })
        .then( function() {
          // Account created, redirect to home
          // $location.path('/questions/intro/1');
          $scope.message = 'Thank you for registering.';

          Auth.getCurrentUser().$promise.then(function(u){

            var section = u.currentSection
            if(section == undefined || section==0)
              $location.url('/questions/intro/0')
            else{
              $state.go('sections.questions', {type:'question',id:section})
            }
          })       


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
        if(!user.oldPassword || user.oldPassword == '')
          user.oldPassword=='guest'
        Auth.changePassword( user.oldPassword, $scope.user.newPassword )
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
