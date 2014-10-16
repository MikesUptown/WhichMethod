'use strict';

angular.module('contraceptionApp')
  .config(function ($stateProvider) {
    $stateProvider

      .state('sections',{
        url:'/questions',
        // abstract:true,
        controller: 'SectionsCtrl',
        templateUrl: "/app/sections/sections.html"
      })

      .state('sections.questions', {
        url: '/:type/:id',
        templateUrl:  function (stateParams){
          if(stateParams.type == 'intro')
            return '/app/sections/intropages/intro' + stateParams.id + '.html';
          else
            return '/app/sections/questions/section0' + stateParams.id + '.html';
          },
        // controller: 'SectionsCtrl'
      });
  });