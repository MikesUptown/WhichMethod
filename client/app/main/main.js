'use strict';

angular.module('contraceptionApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('main', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      })
      .state('privacy', {
        url: '/privacy',
        templateUrl: 'app/main/terms.html',
        controller: 'MainCtrl'
      })
    });

