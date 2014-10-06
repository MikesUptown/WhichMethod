'use strict';

angular.module('contraceptionApp')
  .factory('questionService', function () {
    // AngularJS will instantiate a singleton by calling "new" on this function
  
    var ranking={}


    function initRanking(){
      ranking={
        abstinence : {n:0,p:0},
        ocp : {n:0,p:0},
        pop : {n:0,p:0},
        ortho-evra : {n:0,p:0},
        nuvaring : {n:0,p:0},
        depo : {n:0,p:0},
        mcondom : {n:0,p:0},
        fcondom : {n:0,p:0},
        ccap : {n:0,p:0},
        diaph : {n:0,p:0},
        ec : {n:0,p:0},
        paragard : {n:0,p:0},
        mirena : {n:0,p:0},
        withd : {n:0,p:0},
        sperm : {n:0,p:0},
        sponge : {n:0,p:0},
        fam : {n:0,p:0},
        btl : {n:0,p:0},
        vas : {n:0,p:0},
        implanon : {n:0,p:0},
        bf : {n:0,p:0}
      }
    }
    initRanking();

    var questions = {

      q1:{
        options: [999,777],

        nextQuestion: function(){
          // var option = this.answer
          return 'q2'
        },

        ranking: function(){
          // questions.q1.answer is the same as this.answer
          var answer = this.answer
      
          if(answer<18){
            ranking['vas'].n -= 999
          if(answer<21){
            ranking['implanon'].n -=3
        
            }
          }
        }
      },


      q2:{
        options: [999,777],

        nextQuestion: function(){
          var option = this.answer
          if(option>=200)
            return 'q3'
          else
            return 'q7'
        },

        ranking: function(){
          var option = this.answer
          
            if(questions.q2.answer>=200){
              ranking['ortho-evra'].n -= 2
            if(questions.q2.answer>=250){
              ranking['depo'].n= -2
            
            }
          }
        }
      },

      q3:{
        options: [1,2,3,999,777,888],


        nextQuestion: function(){
          return 'q7'
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
            if(options == 0)
              return q4a
        },

        ranking: function(){
          var option = this.answer
          switch(option){
            case"3":
            if(questions.q4.answer == 0){
              ranking['ocp'].n=-999
              ranking['nuvaring'].n=-999
              ranking['fam'].n=-3
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
            if(questions.q4.answer == 0){
              ranking['ocp'].n=+1
              ranking['pop'].n=+1
              ranking['ortho-evra'].n=+1
              ranking['nuvaring'].n=+1
              ranking['depo'].n=+1
              ranking['mirena'].p+=1
              ranking['fam'].n=-1
              ranking['implanon'].n=+1
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
          if(questions.q5.answer == 1){
            ranking['ocp'].n=+1
            ranking['pop'].n=+1
            ranking['ortho-evra'].n=+1
            ranking['nuvaring'].n=+1
            ranking['depo'].n=+1
            ranking['mirena'].n=+1
            ranking['implanon'].n=+1
            ranking['paragard'].n=-2
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
          if(questions.q6.answer == 1){
            ranking['ocp'].n=+1
            ranking['pop'].n=+1
            ranking['ortho-evra'].n=+1
            ranking['nuvaring'].n=+1
            ranking['depo'].n=+1
            ranking['mirena'].n=+1
            ranking['implanon'].n=+1
          }
        }
      }
      },


      q7:{
        options: [1,0,999,777],

        nextQuestion: function(){
          var option = this.answer
          return 'q7'
        },
      ranking: function(){
        var option = this.answer
        switch(option){
          case"3":
          if(questions.q7.answer == 1){
            ranking['ocp'].n=+1
            ranking['pop'].n=+1
            ranking['ortho-evra'].n=+1
            ranking['nuvaring'].n=+1
            ranking['depo'].n=+1
            ranking['paragard'].n=-2
            ranking['mirena'].n=+1
            ranking['implanon'].n=+1
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
            if(questions.q8.answer == 1){
              ranking['pop'].n=+1
              ranking['ortho-evra'].n=-3
              ranking['nuvaring'].n=+1
              ranking['depo'].n=+1
              ranking['mirena'].n=+1
              ranking[implanon].n=+1
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
            if(questions.q9.answer == 1){
              ranking['ocp'].n=+1
              ranking['pop'].n=+1
              ranking['ortho-evra'].n=+1
              ranking['nuvaring'].n=+1
              ranking['depo'].n=+1
              ranking['mirena'].n=+1
              ranking['implanon'].n=+1
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
            if(questions.q10.answer == 1){
              ranking['ocp'].n=+1
              ranking['pop'].n=+1
              ranking['ortho-evra'].n=+1
              ranking['nuvaring'].n=+1
              ranking['depo'].n=+1
              ranking['mirena'].n=+1
              ranking['implanon'].n=+1
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
            if (questions.q11.answer == 1) {
              ranking['pop'].n=+1
              ranking['depo'].n=+1
              ranking['mirena'].n=+1
              ranking['implanon'].n=+1
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
            if (questions.q12.answer == 1) {
              ranking['ocp'].n=+1
              ranking['pop'].n=+1
              ranking['ortho-evra'].n=+1
              ranking['nuvaring'].n=+1
              ranking['depo'].n=+1
              ranking['mirena'].n=+1
              ranking['implanon'].n=+1
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
            if (questions.q13.answer == 1){
              ranking['ocp'].n=+1
              ranking['pop'].n=+1
              ranking['ortho-evra'].n=+1
              ranking['nuvaring'].n=+1
              ranking['depo'].n=+1
              ranking['mirena'].n=+1
              ranking['implanon'].n=+1
            }
            else if (questions.q13.answer == 2) {
                ranking['ocp'].n=+1
                ranking['pop'].n=+1
                ranking['ortho-evra'].n=+1
                ranking['nuvaring'].n=+1
                ranking['depo'].n=+1
                ranking['mirena'].n=+1
                ranking['implanon'].n=+1
            };
          }
        }
      }
    }


    return {
      questions: questions,
      ranking: ranking,
      initRanking: initRanking,
      getRanking: function(){
        return ranking
      }

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
