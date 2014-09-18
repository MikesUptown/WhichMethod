'use strict';

angular.module('contraceptionApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('servey', {
        url: '/servey',
        templateUrl: 'app/servey/servey.html',
        controller: 'ServeyCtrl',
        authenticate: true
      });
  });