'use strict';

angular.module('contraceptionApp')
  .controller('SectionsCtrl', function ($scope, questionService, $state, Auth, User,$location) {

    //QUESTION LOGIC GOES HERE

    $scope.questions = questionService.questions
    $scope.ranking = questionService.ranking
    var sectionEnd = questionService.sectionEnd
    var currentUser 


    User.get(function(user){
      currentUser = user;
      initUser()

    });

    function initUser(){
      if(currentUser.currentQuestion)
        $scope.currentQuestion=currentUser.currentQuestion
      else
        $scope.currentQuestion='q1'
      

      if(currentUser.currentSection)
        $scope.currentSection = currentUser.currentSection
      else
        $scope.currentSection=1

      for(var i = 0;i<currentUser.answers.length;i++){
        var q = currentUser.answers[i]
        $scope.questions[q.question].answer = q.answer
      }
      $scope.updateRanking()
    }




    $scope.saveAnswers = function(){

      $scope.questions[$scope.currentQuestion].answer = parseInt($scope.questions[$scope.currentQuestion].answer)

      console.log("Answer Saved!")
      $scope.updateRanking()



      var isEnd = sectionEnd.indexOf($scope.currentQuestion)

      if( isEnd > -1  ){
        // if( $scope.currentQuestion == 'q4' && ($state.params.type == 'section' && $state.params.id == 1 )){
          $state.go('.', {type:'intro',id:isEnd+2})
          $scope.currentSection++;

        // }
      }

      $scope.currentQuestion = $scope.questions[$scope.currentQuestion].nextQuestion()

      updateUser()

    }

    function updateUser(){

      var answers=[]
      for(var q in $scope.questions){
        var question = $scope.questions[q]
        if(question.answer != undefined)
          answers.push({
            question: q, 
            answer: question.answer
          })
      }

      currentUser.answers = answers
      currentUser.currentQuestion = $scope.currentQuestion
      currentUser.currentSection = $scope.currentSection

      User.save(currentUser)

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

    $scope.back = function(){

      $scope.questions[$scope.currentQuestion].answer = undefined
      for(var i in $scope.questions){
        var q = $scope.questions[i]
        if(q.nextQuestion() == $scope.currentQuestion){
          $scope.currentQuestion = i
          break
        }
      }
      updateUser()

      var isEnd = sectionEnd.indexOf($scope.currentQuestion)

      if( isEnd > -1  ){
        // if( $scope.currentQuestion == 'q4' && ($state.params.type == 'section' && $state.params.id == 1 )){
          $state.go('.', {type:'question',id:isEnd+1})
          $scope.currentSection--
        // }
      }

    }

    $scope.resetUserData = function(){
      currentUser.answers = []
      currentUser.currentQuestion = 'q1'
      currentUser.currentSection = 1
      $scope.currentSection = 1
      $scope.currentQuestion = 'q1'
      for(var q in $scope.questions){
        var question = $scope.questions[q]
        question.answer = undefined
      }
      User.save(currentUser)
      $state.go('.', {type:'intro',id:1})
    }


    $scope.logout = function() {
      Auth.logout();
      $location.path('/login');
    };

  });
