'use strict';

angular.module('contraceptionApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('survey', {
        url: '/survey',
        templateUrl: 'app/survey/survey.html',
        controller: 'SurveyCtrl',
        authenticate: true
      });
  });