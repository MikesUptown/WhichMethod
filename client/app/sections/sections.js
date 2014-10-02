'use strict';

angular.module('contraceptionApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('sections', {
        url: '/section/:id',
        templateUrl:  function (stateParams){
            return '/app/sections/questions/section0' + stateParams.id + '.html';
          },
        controller: 'SectionsCtrl'
      });
  });