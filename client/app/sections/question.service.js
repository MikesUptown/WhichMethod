'use strict';

angular.module('contraceptionApp')
  .factory('questionService', function () {
    // AngularJS will instantiate a singleton by calling "new" on this function
  
    var ranking={
      abstinence : {n:0,p:0},
      pop : {n:0,p:0}
    }

    var questions = {

      q1:{},

      q7:{
        options: [1,2,3,999,777],


        nextQuestion: function(){
          var option = this.answer
          // if(options= something)
          // return q9
        },


        ranking: function(){
          var option = this.answer
          switch(option){
            case "3":
              if(questions.q1.answer>35){
                ranking['ocp'].n=0
                ranking['ortho-evra'].n=0
                ranking['nuvaring'].n=0
              }
          }
        }
      },



      q8:{
        ranking:function(){
          var option = this.answer
          if(option==0){
            ranking[pop].p += 1
            ranking[orthoevra].p +=1
            // ranking[pop]=ranking[pop] + 1

          }
        }
      }


      

    }


    return {
      questions: questions,
      ranking: ranking

    }


  });
