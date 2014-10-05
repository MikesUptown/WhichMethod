'use strict';

angular.module('contraceptionApp')
  .controller('SectionsCtrl', function ($scope, questionService) {

    //QUESTION LOGIC GOES HERE

    $scope.questions = questionService.questions
    $scope.ranking = questionService.ranking


    $scope.$watch('questions',function(nq,oq){
      if(nq!=oq)
        $scope.saveAnswers()

    }, true)


    $scope.saveAnswers = function(){

      console.log("Answer Saved!")
      $scope.updateRanking()

    }

    $scope.updateRanking = function(){

      $scope.questions.q7.ranking()

      console.log(questionService.ranking)


    }

  });
