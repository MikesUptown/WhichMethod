'use strict';

angular.module('contraceptionApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('main.login', {
        url: 'login',
        views:{
          login:{
            templateUrl: 'app/account/login/login.html',
            controller: 'LoginCtrl'
          }
        }
      })
      .state('signup', {
        url: '/signup',
        // views:{

        //   login:{
        //     templateUrl: 'app/account/signup/signup.html',
        //     controller: 'SignupCtrl'
        //   }
        // }
        templateUrl: 'app/account/signup/signup.html',
        controller: 'SignupCtrl'
      })
      .state('settings', {
        url: '/settings',
        templateUrl: 'app/account/settings/settings.html',
        controller: 'SettingsCtrl',
        authenticate: true
      });
  });