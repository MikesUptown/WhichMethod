'use strict';

angular.module('contraceptionApp')
  .controller('SectionsCtrl', function ($scope, questionService, $state) {

    //QUESTION LOGIC GOES HERE

    $scope.questions = questionService.questions
    $scope.ranking = questionService.ranking


    // $scope.$watch('questions',function(nq,oq){
    //   if(nq!=oq)
    //     $scope.saveAnswers()

    // }, true)

    $scope.currentQuestion='q1'

    $scope.saveAnswers = function(){

      console.log("Answer Saved!")
      $scope.updateRanking()

      $scope.currentQuestion = $scope.questions[$scope.currentQuestion].nextQuestion()

      if( $scope.currentQuestion == 'q4' && ($state.params.type == 'section' && $state.params.id == 1 )){
        $state.go('.', {type:'intro',id:2})
      }

    }

    $scope.updateRanking = function(){

      questionService.initRanking()

      for(var q in $scope.questions){
        if($scope.questions[q].ranking)
          $scope.questions[q].ranking()
      }

      $scope.ranking = questionService.getRanking()
      console.log($scope.ranking)


    }

  });
