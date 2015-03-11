'use strict';

angular.module('contraceptionApp')
  .controller('SectionsCtrl', function ($scope,scoreService, questionService, $state, Auth, User,$location) {

    //QUESTION LOGIC GOES HERE

    var sectionStart = ['q1','q4','q14','q23','q28','q53','q54']

    var sectionEnd = [
      'q3','q13','q22','q27','q52','q53h', 'q54e'
    ];

    $scope.questions = questionService.questions
    $scope.ranking = questionService.ranking
    $scope.problems = questionService.problems;


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

      if(currentUser.currentSection == 8)
        $scope.currentQuestion='end'
      


      if(currentUser.currentSection)
        $scope.currentSection = currentUser.currentSection
      else
        $scope.currentSection=1

      for(var i = 0;i<currentUser.answers.length;i++){
        var q = currentUser.answers[i]
        $scope.questions[q.question].answer = q.answer
      }


      if( sectionStart.indexOf($scope.currentQuestion)>-1){
        $state.go('.', {type:'intro',id:$scope.currentSection})
      }
      else
        $state.go('.', {id:$scope.currentSection})    


      $scope.updateRanking()

    }




    $scope.saveAnswers = function(){

      // $scope.questions[$scope.currentQuestion].answer = parseInt($scope.questions[$scope.currentQuestion].answer)
      var thisQ = $scope.questions[$scope.currentQuestion]

      if(thisQ.selectedOption && thisQ.selectedOption.value != null)
        thisQ.answer = parseInt(thisQ.selectedOption.value)
      else if(thisQ.textInput != null){
        thisQ.answer = parseInt(thisQ.textInput)
        thisQ.textInput = parseInt(thisQ.textInput)
      }
      else if(thisQ.selectedOptions){
        thisQ.answer = {'array': thisQ.selectedOptions.slice(0) }
      }






      var isEnd = sectionEnd.indexOf($scope.currentQuestion)

      if( isEnd > -1  ){
        // if( $scope.currentQuestion == 'q4' && ($state.params.type == 'section' && $state.params.id == 1 )){
          $state.go('.', {type:'intro',id:isEnd+2})
          $scope.currentSection++;

        // }
      }

      $scope.currentQuestion = $scope.questions[$scope.currentQuestion].nextQuestion()

      console.log("Answer Saved!")
      $scope.updateRanking()

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
        if($scope.questions[q].ranking && $scope.questions[q].answer != undefined)
          $scope.questions[q].ranking()
      }

      // $scope.ranking = questionService.getRanking()
      $scope.results = questionService.getResults()
      $scope.score = scoreService.calculateScore($scope.results,questionService.survey)
      $scope.colors = scoreService.getColors()

      console.log($scope.ranking)
    
    }

    $scope.back = function(){

      if($scope.questions[$scope.currentQuestion]){
        $scope.questions[$scope.currentQuestion].answer = undefined
      }

      for(var i in $scope.questions){
        var q = $scope.questions[i]
        if(q.nextQuestion() == $scope.currentQuestion){
          $scope.currentQuestion = i
          break
        }
      }

      if($scope.currentQuestion=="end")
        $scope.currentQuestion=i        


      var isEnd = sectionEnd.indexOf($scope.currentQuestion)

      if( isEnd > -1  ){
        // if( $scope.currentQuestion == 'q4' && ($state.params.type == 'section' && $state.params.id == 1 )){
          $scope.currentSection--
          $state.go('.', {type:'question',id:isEnd+1})
        // }
      }

      updateUser()


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

      // reset the bc problems list
      $scope.problems.curBcProbNum = 0;
      // while ($scope.problems.bcProblemList.length) { 
      //   $scope.problems.bcProblemList.pop(); 
      // }
      // while ($scope.problems.problemsPerBc.length) { 
      //   $scope.problems.problemsPerBc.pop(); 
      // }
      User.save(currentUser)
      $state.go('.', {type:'intro',id:1})
    }


    $scope.logout = function() {
      Auth.logout();
      $location.path('/login');
    };

  });
