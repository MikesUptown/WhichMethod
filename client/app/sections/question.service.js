'use strict';

angular.module('contraceptionApp')
  .factory('questionService', function () {
    // AngularJS will instantiate a singleton by calling "new" on this function
  
    var ranking={
      abstinence : {n:0,p:0},
      pop : {n:0,p:0}
    }

    var questions = {

      q1:{
        options: [999,777],

        nextQuestion: function(){
          var option = this.answer
        },

        ranking: function(){
          var option = this.answer
          switch(option){
            case"3":
            if(questions.q1.answer<18){
              ranking[''].n=999
            if(questions.q1.answer<21){
              ranking['implanon'].n=-3
            }
            }
          }
        }
      },


      q2:{
        options: [999,777],

        nextQuestion: function(){
          var option = this.answer
        },

        ranking: function(){
          var option = this.answer
          switch(option){
            case"3":
            if(questions.q2.answer>200){
              ranking['ortho-evra'].n= -2
            if(questions.q2.answer>250){
              ranking['depo'].n= -2
            }
            }
          }
        }
      },

      q3:{
        options: [1,2,3,999,777,888],

        nextQuestion: function(){
          var option = this.answer
          // if(options= something)
          // return q9
        },

        ranking: function(){
          var option = this.answer
          switch(option){
            case "3":
              if(questions.q3.answer>35){
                ranking['ocp'].n=0
                ranking['ortho-evra'].n=0
                ranking['nuvaring'].n=0
              }
          }
        }
      },

      q4:{
        options: [1,0,999,777],

        nextQuestion: function(){
          var option = this.answer
        },

        ranking: function(){
          var option = this.answer
          switch(option){
            case"3":
            if(questions.q4.answer){
              ranking
              ranking
              ranking
            }
          }
        }
      },

      q4a:{
        options: [1,0,999,777,888],

        nextQuestion: function(){
          var option = this.answer
        },

        ranking: function(){
          var option = this.answer
          switch(option){
            case"3":
            if(questions.q4.answer){
              ranking
              ranking
              ranking
            }
          }
        }
      },


      q5:{
        options: [1,0,999,777],

        nextQuestion: function(){
          var option = this.answer
        },
      ranking: function(){
        var option = this.answer
        switch(option){
          case"3":
          if(questions.q5.answer){
            ranking
            ranking
            ranking
          }
        }
      }
      },


      q6:{
        options: [1,0,999,777],

        nextQuestion: function(){
          var option = this.answer
        },
      ranking: function(){
        var option = this.answer
        switch(option){
          case"3":
          if(questions.q6.answer){
            ranking
            ranking
            ranking
          }
        }
      }
      },


      q7:{
        options: [1,0,999,777],

        nextQuestion: function(){
          var option = this.answer
        },
      ranking: function(){
        var option = this.answer
        switch(option){
          case"3":
          if(questions.q7.answer){
            ranking
            ranking
            ranking
          }
        }
      }
      },


      q8:{
        options: [1,0,999,777],

        nextQuestion: function(){
          var option = this.answer
        },
        ranking: function(){
          var option = this.answer
          switch(option){
            case"3":
            if(questions.q8.answer){
              ranking
              ranking
              ranking
            }
          }
        }
      },

      q9:{
        options: [1,0,999,777],

        nextQuestion: function(){
          var option = this.answer
        },
        ranking: function(){
          var option = this.answer
          switch(option){
            case"3":
            if(questions.q9.answer){
              ranking
              ranking
              ranking
            }
          }
        }
      },

      q10:{
        options: [1,0,999,777],

        nextQuestion: function(){
          var option = this.answer
        },
        ranking: function(){
          var option = this.answer
          switch(option){
            case"3":
            if(questions.q10.answer){
              ranking
              ranking
              ranking
            }
          }
        }
      },

      q11:{
        options: [1,0,999,777],

        nextQuestion: function(){
          var option = this.answer
        },
        ranking: function(){
          var option = this.answer
          switch(option){
            case"3":
            if (questions.q11.answer) {
              ranking
              ranking
              ranking
            }
          }
        }
      },


      q12:{
        options: [1,0,999,777],

        nextQuestion: function(){
          var option = this.answer
        },
        ranking: function(){
          var option = this.answer
          switch(option){
            case"3":
            if (questions.q12.answer) {
              ranking
              ranking
              ranking
            };
          }
        }
      },

      q13:{
        options: [0,1,2,999,777,888],

        nextQuestion: function(){
          var option = this.answer
        },
        ranking: function(){
          var option = this.answer
          switch(option){
            case"3":
            if (questions.q13.answer){
              ranking
              ranking
              ranking
            }
          }
        }
      },


    return {
      questions: questions,
      ranking: ranking

    }


  });



    //           ranking:function(){
    //       var option = this.answer
    //       if(option==0){
    //         ranking[pop].p += 1
    //         ranking[orthoevra].p +=1
    //         // ranking[pop]=ranking[pop] + 1

    //       }



    //     }
    //   }


    // }