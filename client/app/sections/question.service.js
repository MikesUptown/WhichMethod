'use strict';

angular.module('contraceptionApp')
  .factory('questionService', function () {
    // AngularJS will instantiate a singleton by calling "new" on this function
  
    var ranking={}

    //last question in each section
    var sectionEnd=[
      'q3','q13','q22'
    ]


    function initRanking(){
      ranking={
        abstinence : {n:0,p:0},
        ocp : {n:0,p:0},
        pop : {n:0,p:0},
        'ortho-evra' : {n:0,p:0},
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
        bf : {n:0,p:0},
      }
    }
    initRanking();

    var questions = {

    // How old are you?

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

    // How much do you weigh? Please enter our weight in the number keyboard.
      q2:{
        options: [999,777],

        nextQuestion: function(){
            return 'q3'
        },

        ranking: function(){
          var option = this.answer
          
            if(questions.q2.answer>=200){
              ranking['ortho-evra'].n -= 2
            if(questions.q2.answer>=250){
              ranking['depo'].n -=2
            
            }
          }
        }
      },


    // How often do you smoke cigarettes or cigars or use smokeless tobacco?
      q3:{
        options: [1,2,3,999,777,888],

        nextQuestion: function(){
          return 'q4'
        },

        ranking: function(){

          //what does option mean
          var answer = this.answer

          //WHY DID YOU KEEP THIS switch in here? 
          // switch(option){
            // case "3":

          //check the docs! what question do you need to check against?

          // need to ask them about these:
          // is it =0 -=999 or =-999
          // double check this!
          if(answer==3){
            if(questions.q1.answer>35){
              ranking['ocp'].n-=999
              ranking['ortho-evra'].n-=999
              ranking['nuvaring'].n-=999
            }
          }
        }
      },


    // When you are not using birth control, do you have regular monthly periods?
      q4:{
        options: [1,0,999,777],

        nextQuestion: function(){
          var answer = this.answer
            if(answer == 0)
              return 'q4a'
            else
              return 'q5'
        },

        ranking: function(){
          var answer = this.answer
          // please read up on switch and what it does
          // switch(option){
          //   case"3":
          if(questions.q4.answer == 0){
            ranking['ocp'].n=-999
            ranking['nuvaring'].n=-999
            // is this correct?
            ranking['fam'].n=-3
          }
          
        }
      },


    // Do you have three or fewer periods per year?
      q4a:{
        options: [1,0,999,777,888],

        nextQuestion: function(){
          var answer = this.answer
        },

        ranking: function(){
          var answer = this.answer

          if(questions.q4.answer == 0){
            ranking['ocp'].p+=1
            ranking['pop'].p+=1
            ranking['ortho-evra'].p+=1
            ranking['nuvaring'].p+=1
            ranking['depo'].p+=1
            ranking['mirena'].p+=1
            ranking['fam'].n-=1
            ranking['implanon'].p=+1
          }
        

        }
      },

    // When you are not using birth control, do you have very heavy periods?
      q5:{
        options: [1,0,999,777],

        nextQuestion: function(){
          var option = this.answer
          return 'q6'
        },

      ranking: function(){
        var option = this.answer
        // switch(option){
        //   case"3":
          if(questions.q5.answer == 1){
            ranking['ocp'].p+=1
            ranking['pop'].p+=1
            ranking['ortho-evra'].p+=1
            ranking['nuvaring'].p+=1
            ranking['depo'].p+=1
            ranking['mirena'].p+=1
            ranking['implanon'].p+=1
            ranking['paragard'].n-=2
          }
        }
      
      },

    // When you are not using birth control, do you have periods which last longer than 7 days?
      q6:{
        options: [1,0,999,777],

        nextQuestion: function(){
          var option = this.answer
          if(option == 0)
              return 'q7'
        },
        ranking: function(){
          var option = this.answer
        // switch(option){
        //   case"3":
          if(questions.q6.answer == 1){
            ranking['ocp'].p+=1
            ranking['pop'].p+=1
            ranking['ortho-evra'].p+=1
            ranking['nuvaring'].p+=1
            ranking['depo'].p+=1
            ranking['mirena'].p+=1
            ranking['implanon'].p+=1
          }
        }
      
      },

    // When you are not using birth control, do you have painful periods or bad cramps
    // during your period?

      q7:{
        options: [1,0,999,777],

        nextQuestion: function(){
          var option = this.answer
          if(options == 0)
            return 'q8'
        },
        ranking: function(){
          var answer = this.answer
        // switch(option){
        //   case"3":
          if(questions.q7.answer == 1){
            ranking['ocp'].p+=1
            ranking['pop'].p+=1
            ranking['ortho-evra'].p+=1
            ranking['nuvaring'].p+=1
            ranking['depo'].p+=1
            ranking['paragard'].n-=2
            ranking['mirena'].p+=1
            ranking['implanon'].p+=1
          }
        }
      },

    // When you are not using birth control, do you have breast
    // tenderness during your period?
      q8:{
        options: [1,0,999,777],

        nextQuestion: function(){
          var answer = this.answer
          if(answer == 0)
            return 'q9'
        },
        ranking: function(){
          var answer = this.answer
          // switch(option){
          //   case"3":
            if(questions.q8.answer == 1){
              ranking['pop'].p+=1
              ranking['ortho-evra'].n-=3
              ranking['nuvaring'].p+=1
              ranking['depo'].p+=1
              ranking['mirena'].p+=1
              ranking[implanon].p+=1
            }
          }
        
      },

    // When you are not using birth control, do you have depression or anxiety during your period?
      q9:{
        options: [1,0,999,777],

        nextQuestion: function(){
          var answer = this.answer
          if(answer == 0)
              return 'q10'
        },
        ranking: function(){
          var answer = this.answer
          // switch(option){
          //   case"3":
            if(questions.q9.answer == 1){
              ranking['ocp'].p+=1
              ranking['pop'].p+=1
              ranking['ortho-evra'].p+=1
              ranking['nuvaring'].p+=1
              ranking['depo'].p+=1
              ranking['mirena'].p+=1
              ranking['implanon'].p+=1
            }
          }
        
      },


    // When you are no using birth control, do you have bleeding or flouid retention
    // during your period?
      q10:{
        options: [1,0,999,777],

        nextQuestion: function(){
          var answer = this.answer
          if(answer == 0)
            return 'q11'
        },
        ranking: function(){
          var answer = this.answer
          // switch(option){
          //   case"3":
            if(questions.q10.answer == 1){
              ranking['ocp'].p+=1
              ranking['pop'].p+=1
              ranking['ortho-evra'].p+=1
              ranking['nuvaring'].p+=1
              ranking['depo'].p+=1
              ranking['mirena'].p+=1
              ranking['implanon'].p+=1
            }
          }
        
      },


    // When you are not using birth control, do you have bad headaches with your period?
      q11:{
        options: [1,0,999,777],

        nextQuestion: function(){
          var option = this.answer
        },
        ranking: function(){
          var option = this.answer
          // switch(option){
          //   case"3":
          if (questions.q11.answer == 1) {
            ranking['pop'].p=+1
            ranking['depo'].p=+1
            ranking['mirena'].p=+1
            ranking['implanon'].p=+1
          }
          
        }
      },

    // When you are not using birth control, do you have significant PMS?
      q12:{
        options: [1,0,999,777],

        nextQuestion: function(){
          var option = this.answer
        },
        ranking: function(){
          var option = this.answer
          // switch(option){
          //   case"3":
          if (questions.q12.answer == 1) {
            ranking['ocp'].p=+1
            ranking['pop'].p=+1
            ranking['ortho-evra'].p=+1
            ranking['nuvaring'].p=+1
            ranking['depo'].p=+1
            ranking['mirena'].p=+1
            ranking['implanon'].p=+1
          };
          
        }
      },

  //   // How often do these symptoms cause you to miss work or school?
  //     q13:{
  //       options: [0,1,2,999,777,888],

  //       nextQuestion: function(){
  //         var option = this.answer
  //       },
  //       ranking: function(){
  //         var option = this.answer
  //         // switch(option){
  //         //   case"3":
  //           if (questions.q13.answer == 1){
  //             ranking['ocp'].p=+1
  //             ranking['pop'].p=+1
  //             ranking['ortho-evra'].p=+1
  //             ranking['nuvaring'].p=+1
  //             ranking['depo'].p=+1
  //             ranking['mirena'].p=+1
  //             ranking['implanon'].p=+1
  //           }
  //           else if (questions.q13.answer == 2) {
  //               ranking['ocp'].p=+1
  //               ranking['pop'].p=+1
  //               ranking['ortho-evra'].p=+1
  //               ranking['nuvaring'].p=+1
  //               ranking['depo'].p=+1
  //               ranking['mirena'].p=+1
  //               ranking['implanon'].p=+1
  //           };
          
  //       }
  //     }
  //   },

  //   // The next set of questions is about your sexual behavior. By sex, I mean vaginal sex. Please remember that your answers
  //   // strictly confidential. How would you describe your current sexual relationship?
  //     q14:{
  //       options: [0,1,2,3,999,777],

  //       nextQuestion: function(){
  //         var option = this.answer
  //       },
  //       ranking: function(){
  //         var option = this.answer
  //         // switch(option){
  //         //   case"3":
  //           if (questions.q14.answer == 2){
  //             ranking['paragard'].n-=1
  //             ranking['mirena'].n-=999
  //           }
          
  //       }
  //     }
  //   },

  //     // During the last 12 months how many men, if any, have you had sexual intercourse with? Please count every male partner,
  //     // even those you had sex with only once.
  //     q15:{
  //       options: [999,777],

  //       nextQuestion: function(){
  //         var option = this.answer
  //       },
  //       ranking: function(){
  //         // if answer is greater than 10 && less than 555
  //         var answer = this.answer
      
  //         if(answer>10 && <555){
  //           ranking['paragard'].n-=999
  //           ranking['mirena'].n-=999
        
  //           }
  //         }
  //     }
  //   },

  //     // Have you ever had an unplanned pregnancy.
  //     q16:{
  //       options: [1,0,999,777],

  //       nextQuestion: function(){
  //         var answer = this.answer
  //         if(answer == 1)
  //           return 'q16a'
  //         else
  //           return 'q17'

  //       },
  //       ranking: function(){

  //         var answer = this.answer
  //         }
  //     }
  //   },    


  //     // How many unplanned pregnancies have you had. Enter number on keyboard.
  //     q16a:{
  //       options: [999,777,888],

  //       nextQuestion: function(){
  //         var answer = this.answer
  //         if(answer == 1)
  //           return 'q16a'
  //         else
  //           return 'q17'

  //       },
  //       ranking: function(){

  //         var answer = this.answer
  //         }
  //     }
  //   }, 
  //     // Were you using any method of birth control or doing anything to prevent from getting pregnant the (first) time you
  //     // had an unplanned pregnancy?
  //     q16b:{
  //       options: [1,0,999,777,888],

  //       nextQuestion: function(){
  //         var answer = this.answer
  //         if(answer == 1)
  //           return 'q16bi'
  //         else
  //           return 'q17'

  //       },
  //       ranking: function(){
  //         // 
  //         var answer = this.answer
  //         }
  //     }
  //   }, 

  //     // The (first) time you had an unplanned preganancy, what method of birth control were you using? I will show
  //     // you four screens that have different birth control methods. Please choose ALL the methods you were using
  //     q16bi:{
  //       options: [1,0,999,777,888],

  //       nextQuestion: function(){
  //         var answer = this.answer
  //         if(answer == 1)
  //           return 'q16bi'
  //         else
  //           return 'q17'

  //       },
  //       ranking: function(){
  //         // if answer is greater than 10 && less than 555
  //         var answer = this.answer
      
  //         if(answer>10 && <555){
  //           ranking['paragard'].n-=999
  //           ranking['mirena'].n-=999
        
  //           }
  //         }
  //     }
  //   },

  //     // Now I'm going to ask you about different birth control methods that you might be interested in using now.
  //     // I will show you four screens that have different birth control methods. You can choose as many methods as you
  //     // would like
  //     q17:{
  //       options: [ ],

  //       nextQuestion: function(){
  //         var answer = this.answer

  //       },
  //       ranking: function(){

  //         var answer = this.answer
  //         }
  //     }
  //   },

  //     // Have you EVER used any method of birth control?
  //     q18:{
  //       options: [1,0,999,777],

  //       nextQuestion: function(){
  //         var answer = this.answer
  //         if(answer == 1)
  //           return 'q18a'
  //         else
  //           return 'q20'

  //       },
  //       ranking: function(){

  //         var answer = this.answer
  //         }
  //     }
  //   }, 

  //     // Are you using birth control now?
  //     q18a:{
  //       options: [1,0,999,777,888],

  //       nextQuestion: function(){
  //         var answer = this.answer
  //         if(answer == 1)
  //           return 'q18ai'
  //         else
  //           return 'q19'

  //       },
  //       ranking: function(){

  //         var answer = this.answer
  //         }
  //     }
  //   },

  //     // What birth control method are you using now? I will show you four screens that have different birth
  //     // control methods. Please choose ALL the methods your are using now?
  //     q18ai:{
  //       options: [ ],

  //       nextQuestion: function(){
  //         var answer = this.answer

  //       },
  //       ranking: function(){

  //         var answer = this.answer
  //         }
  //     }
  //   },     

  //     // Have you EVER used a birth control method that you didn't like, that didn't work, or that
  //     // you had other problems with?
  //     q19:{
  //       options: [1,0,999,777,888],

  //       nextQuestion: function(){
  //         var answer = this.answer
  //         if(answer == 1)
  //           return 'q19a'
  //         else
  //           return 'q19ai'

  //       },
  //       ranking: function(){

  //         var answer = this.answer
  //         }
  //     }
  //   }, 

  //     // What method did you have a problem with? I will show you 4 screens that have different birth control methods.
  //     // Please select ALL the birth contorl methods below that you have had a problem with. If you did not have a problem
  //     // with any of these methods press the arrow key to go to the next screen
  //     q19a:{
  //       options: [1,0,999,777],

  //       nextQuestion: function(){
  //         var answer = this.answer
  //         if(answer == 1)
  //           return 'q18a'
  //         else
  //           return 'q20'
  //       },
  //       ranking: function(){

  //         var answer = this.answer
  //         }
  //     }
  //   }, 

  //     // What problems did you have while using___?
  //     q19ai:{
  //       options: [999,777],

  //       nextQuestion: function(){
  //         var answer = this.answer
  //           return 'q20'

  //       },
  //       ranking: function(){

  //         var answer = this.answer
  //         }
  //     }
  //   }, 


  //     // When would you like to become pregnant, in..l.?
  //     q20:{
  //       options: [1,2,3,4,5,777,999],

  //       nextQuestion: function(){
  //         var answer = this.answer
  //           return 'q21'

  //       },
  //       ranking: function(){

  //         var answer = this.answer
  //         }
  //     }
  //   }, 

  //     // What is most important when choosing a birth control method? Please select the three most important to you?
  //     q21:{
  //       options: [1,0,999,777],

  //       nextQuestion: function(){
  //         var answer = this.answer
  //           return 'q22'
  //       },
  //       ranking: function(){

  //         var answer = this.answer
  //         }
  //     }
  //   }, 


  //   // Please select on this timeline how often you want to think about and take action for you birth control method?
  //   q22:{
  //     options: [],

  //     nextQuestion: function(){
  //       var answer = this.answer
  //         return 'q23'

  //       },
  //       ranking: function(){
  //       var answer = this.answer
  //       }
  //   }
  // }, 

  // // Would you be okay with regular scheduled bleeding?
  // q23:{
  //   options: [1,0,999,777],

  //   nextQuestion: function(){
  //     var answer = this.answer
  //       return 'q24'

  //       },
  //       ranking: function(){
  //       var answer = this.answer
  //       }
  //   }
  // }, 


  // // Would you be okay with unscheduled bleeding and/or spotting?
  // q24:{
  //   options: [1,0,999,777],

  //   nextQuestion: function(){
  //     var answer = this.answer
  //       return 'q25'

  //       },
  //       ranking: function(){
  //       var answer = this.answer
  //         }
  //     }
  //   },   

  // // Would you be okay with no bleeding at all?
  // q25:{
  //   options: [1,0,999,777],

  //   nextQuestion: function(){
  //     var answer = this.answer
  //       return 'q26'

  //       },
  //       ranking: function(){
  //       var answer = this.answer
  //         }
  //     }
  //   }, 

  // // Do you need a birth control method which you can keep private?
  // q26:{
  //   options: [1,0,999,777],

  //   nextQuestion: function(){
  //     var answer = this.answer
  //       if(answer == 1)
  //         return 'q26a'
  //       else
  //         return 'q27'

  //       },
  //       ranking: function(){
  //       var answer = this.answer
  //         }
  //     }
  //   }, 


  // // Do you want to keep it private from your boyfriend/girlfriend/partner?
  // q26a:{
  //   options: [1,0,999,777,888],

  //   nextQuestion: function(){
  //     var answer = this.answer
  //       return '26b'
  //       },
  //       ranking: function(){
  //       var answer = this.answer
  //         }
  //     }
  //   }, 

  // // Do you want to keep it private from your family or your friends?
  // q26b:{
  //   options: [1,0,999,777,888],

  //   nextQuestion: function(){
  //     var answer = this.answer
  //       return 'q27'

  //       },
  //       ranking: function(){
  //       var answer = this.answer
  //         }
  //     }
  //   }, 


  // // Would it be OK for you to use a birth control method that you have to interrupt sexual activity to use?
  // q27:{
  //   options: [1,0,999,777],

  //   nextQuestion: function(){
  //     var answer = this.answer

  //       },
  //       ranking: function(){
  //       var answer = this.answer
  //         }
  //     }
  //   },

  // // This begins the first question of the new section


  // // Have you had a baby in the last 6 months?
  // q28:{
  //   options: [1,0,999,777],

  //   nextQuestion: function(){
  //     var answer = this.answer
  //       if(answer == 1)
  //         return 'q28a'
  //       else
  //         return 'q29'

  //       },
  //       ranking: function(){
  //       var answer = this.answer
  //         }
  //     }
  //   },

  // // Was your baby born less than 3 weeks ago?
  // q28a:{
  //   options: [1,0,999,777,888],

  //   nextQuestion: function(){
  //     var answer = this.answer
  //       if(answer == 0,999)
  //         return 'q28b'
  //       else(answer == 1)
  //         return 'q29'

  //       },
  //       ranking: function(){
  //       var answer = this.answer
  //         }
  //     }
  //   },


  // // Are you breastfeeding a child now?
  // q28b:{
  //   options: [1,0,999,777,888],

  //   nextQuestion: function(){
  //     var answer = this.answer
  //       return 'q29'

  //       },
  //       ranking: function(){
  //       var answer = this.answer
  //         }
  //     }
  //   },


  // // Has a doctor, nurse or health professional EVER told you that you had high blood pressure, 
  // // also called hypertension?
  // q29:{
  //   options: [1,0,999,777,888],

  //   nextQuestion: function(){
  //     var answer = this.answer
  //       if(answer == 1)
  //         return 'q29a'
  //       else
  //         return 'q30'
  //       },
  //       ranking: function(){
  //       var answer = this.answer
  //         }
  //     }
  //   },

  // // Are you currently taking medicine for high blood pressure?
  // q29a:{
  //   options: [1,0,999,777,888],

  //   nextQuestion: function(){
  //     var answer = this.answer
  //       return 'q30'
  //       },
  //       ranking: function(){
  //       var answer = this.answer
  //         }
  //     }
  //   },

  // // Has a doctor, nurse, or other health professional EVER told you that you had blood clots, also called clot
  // // in a vein or DVT?
  // q30:{
  //   options: [1,0,999,777],

  //   nextQuestion: function(){
  //     var answer = this.answer
  //       return 'q31'
  //       },
  //       ranking: function(){
  //       var answer = this.answer
  //         }
  //     }
  //   },


  // // Has a doctor, nurse, or other health professional EVER told you that you had pulmonary embolus,
  // // also called a clot in the lung?
  // q31:{
  //   options: [1,0,999,777],

  //   nextQuestion: function(){
  //     var answer = this.answer
  //       return 'q32'

  //       },
  //       ranking: function(){
  //       var answer = this.answer
  //         }
  //     }
  //   },

  // // Have you had surgery in the past three months?
  // q32:{
  //   options: [1,0,999,777],

  //   nextQuestion: function(){
  //     var answer = this.answer
  //       if(answer == 1)
  //         return 'q32a'
  //       else
  //         return 'q33'

  //       },
  //       ranking: function(){
  //       var answer = this.answer
  //         }
  //     }
  //   },    

  // // Is it hard moving around because of the surgery?
  // q32a:{
  //   options: [1,0,999,777,888],

  //   nextQuestion: function(){
  //     var answer = this.answer
  //         return 'q33'

  //       },
  //       ranking: function(){
  //       var answer = this.answer
  //         }
  //     }
  //   }, 


  // // Has a doctor, nurse, or other health professional EVER told you that you had diabetes?
  // q33:{
  //   options: [1,0,999,777],

  //   nextQuestion: function(){
  //     var answer = this.answer
  //       if(answer == 1)
  //         return 'q32a'
  //       else
  //         return 'q33'

  //       },
  //       ranking: function(){
  //       var answer = this.answer
  //         }
  //     }
  //   }, 

  // // Have you had diabetes for more than 20 years?
  // q33a:{
  //   options: [1,0,999,777],

  //   nextQuestion: function(){
  //     var answer = this.answer
  //       if(answer == 1)
  //         return 'q33a'
  //       else
  //         return 'q33b'

  //       },
  //       ranking: function(){
  //       var answer = this.answer
  //         }
  //     }
  //   }, 


  // // Do you have problems with your kidneys, eyes or nerves because of diabetes?
  // q33b:{
  //   options: [1,0,999,777,888],

  //   nextQuestion: function(){
  //     var answer = this.answer
  //         return 'q34'

  //       },
  //       ranking: function(){
  //       var answer = this.answer
  //         }
  //     }
  //   }, 

  // // Has a doctor, nurse, or other health professional EVER told you that you had a stroke?
  // q34:{
  //   options: [1,0,999,777,888],

  //   nextQuestion: function(){
  //     var answer = this.answer
  //         return 'q35'

  //       },
  //       ranking: function(){
  //       var answer = this.answer
  //         }
  //     }
  //   }, 

  // // Has a doctor, nurse, or other health professional EVER told you that you had a clotting disorder?
  // q35:{
  //   options: [1,0,999,777],

  //   nextQuestion: function(){
  //     var answer = this.answer
  //         return 'q36'

  //       },
  //       ranking: function(){
  //       var answer = this.answer
  //         }
  //     }
  //   }, 

  // // Do you have migraine headaches?
  // q36:{
  //   options: [1,0,999,777],

  //   nextQuestion: function(){
  //     var answer = this.answer
  //       if(answer == 1)
  //         return 'q32a'
  //       else
  //         return 'q33'

  //       },
  //       ranking: function(){
  //       var answer = this.answer
  //         }
  //     }
  //   }, 


  // // Do you have migraine headaches with an aura? An aoura is seeing spots or wavy lines
  // // before or during the migraine headache
  // q36a:{
  //   options: [1,0,999,777],

  //   nextQuestion: function(){
  //     var answer = this.answer
  //       if(answer == 1)
  //         return 'q32a'
  //       else
  //         return 'q33'

  //       },
  //       ranking: function(){
  //       var answer = this.answer
  //         }
  //     }
  //   }, 

  // // Has a doctor, nurse, or other health professional EVER told you that you had a
  // // molar pregnancy?
  // q37:{
  //   options: [1,0,999,777],

  //   nextQuestion: function(){
  //     var answer = this.answer
  //         return 'q38'

  //       },
  //       ranking: function(){
  //       var answer = this.answer
  //         }
  //     }
  //   }, 

  // // Has a doctor, nurse, or other health professional EVER told you that you had AIDS?
  // q38:{
  //   options: [1,0,999,777],

  //   nextQuestion: function(){
  //     var answer = this.answer
  //         return 'q39'

  //       },
  //       ranking: function(){
  //       var answer = this.answer
  //         }
  //     }
  //   }, 

  // // Has a doctor, nurse, or other health professional EVER told you that you had pelvic tuberculosis?
  // q39:{
  //   options: [1,0,999,777],

  //   nextQuestion: function(){
  //     var answer = this.answer
  //         return 'q40'

  //       },
  //       ranking: function(){
  //       var answer = this.answer
  //         }
  //     }
  //   }, 

  // // Has a doctor, nurse, or other health professional EVER told you that you had
  // // toxic shock syndrome (tss)?
  // q40:{
  //   options: [1,0,999,777],

  //   nextQuestion: function(){
  //     var answer = this.answer
  //         return 'q41'

  //       },
  //       ranking: function(){
  //       var answer = this.answer
  //         }
  //     }
  //   }, 

  // // Has a doctor, nurse, or other health professional EVER told you that you had
  // // high cholesterol?
  // q41:{
  //   options: [1,0,999,777],

  //   nextQuestion: function(){
  //     var answer = this.answer
  //         return 'q42'

  //       },
  //       ranking: function(){
  //       var answer = this.answer
  //         }
  //     }
  //   }, 

  // // In the past 3 monthos has a doctor, nurse, or other health professional told you that you
  // // had pelvid inflammatory disease (PID)?
  // q42:{
  //   options: [1,0,999,777],

  //   nextQuestion: function(){
  //     var answer = this.answer
  //         return 'q43'

  //       },
  //       ranking: function(){
  //       var answer = this.answer
  //         }
  //     }
  //   }, 

  // // Has a doctor, nurse, or other health professional EVER told you that you had
  // // endometriosis?
  // q43:{
  //   options: [1,0,999,777],

  //   nextQuestion: function(){
  //     var answer = this.answer
  //         return 'q44'

  //       },
  //       ranking: function(){
  //       var answer = this.answer
  //         }
  //     }
  //   }, 


  // // Has a doctor, nurse, or other health professional EVER told you that you had
  // // cancer or a malignancy of any kind?
  // q44:{
  //   options: [1,0,999,777],

  //   nextQuestion: function(){
  //     var answer = this.answer
  //       if(answer == 1)
  //         return 'q44a'
  //       else
  //         return 'q45'

  //       },
  //       ranking: function(){
  //       var answer = this.answer
  //         }
  //     }
  //   }, 


  // // Have you ever had breast cancer, liver tumors or liver cancer?
  // q44a:{
  //   options: [1,0,999,777],

  //   nextQuestion: function(){
  //     var answer = this.answer
  //         return 'q44b'

  //       },
  //       ranking: function(){
  //       var answer = this.answer
  //         }
  //     }
  //   }, 

  // // Haver you ever had endometrial cancer, ovarian cancer, or cervical cancer?
  // q44b:{
  //   options: [1,0,999,777],

  //   nextQuestion: function(){
  //     var answer = this.answer
  //         return 'q45'

  //       },
  //       ranking: function(){
  //       var answer = this.answer
  //         }
  //     }
  //   }, 


  // // Has a doctor, nurse, or other health professional EVER told you that you had a heart
  // // attach, also called a myocardial infarction, heart disease or vascular disease?
  // q45:{
  //   options: [1,0,999,777],

  //   nextQuestion: function(){
  //     var answer = this.answer
  //         return 'q46'

  //       },
  //       ranking: function(){
  //       var answer = this.answer
  //         }
  //     }
  //   }, 

  // // Has a doctor, nurse, or other health professional EVER told you that you had complicated
  // // valvular heart disease?
  // q46:{
  //   options: [1,0,999,777],

  //   nextQuestion: function(){
  //     var answer = this.answer
  //         return 'q47'

  //       },
  //       ranking: function(){
  //       var answer = this.answer
  //         }
  //     }
  //   }, 

  // // Has a doctor, nurse, or other health professional EVER told you that you had liver
  // // or gallbladder problems?
  // q47:{
  //   options: [1,0,999,777],

  //   nextQuestion: function(){
  //     var answer = this.answer
  //         return 'q46'

  //       },
  //       ranking: function(){
  //       var answer = this.answer
  //         }
  //     }
  //   }, 


  // // Has a doctor, nurse, or other health professional EVER told you that you had
  // // liver or gallbladder disease or gallstones?
  // q47a:{
  //   options: [1,0,999,777],

  //   nextQuestion: function(){
  //     var answer = this.answer
  //         return 'q46'

  //       },
  //       ranking: function(){
  //       var answer = this.answer
  //         }
  //     }
  //   }, 

  // // Has a doctor, nurse, or other health professional EVER told you that you had cirrhosis
  // // or active hepatitis?
  // q47b:{
  //   options: [1,0,999,777],

  //   nextQuestion: function(){
  //     var answer = this.answer
  //         return 'q48'

  //       },
  //       ranking: function(){
  //       var answer = this.answer
  //         }
  //     }
  //   }, 

  // // Has a doctor, nurse, or other health professional EVER told you that you had a 
  // // seizure disorder or epilepsy?
  // q48:{
  //   options: [1,0,999,777],

  //   nextQuestion: function(){
  //     var answer = this.answer
  //         return 'q49'

  //       },
  //       ranking: function(){
  //       var answer = this.answer
  //         }
  //     }
  //   }, 

  // // Has a doctor, nurse, or other health professional EVER told you that you had
  // // sickle cell anemia?
  // q49:{
  //   options: [1,0,999,777],

  //   nextQuestion: function(){
  //     var answer = this.answer
  //         return 'q46'

  //       },
  //       ranking: function(){
  //       var answer = this.answer
  //         }
  //     }
  //   }, 

  // // Has a doctor, nurse, or other health professional EVER told you that you
  // // had anemia, sometimes called low blood or tired blood?
  // q50:{
  //   options: [1,0,999,777],

  //   nextQuestion: function(){
  //     var answer = this.answer
  //         return 'q51'

  //       },
  //       ranking: function(){
  //       var answer = this.answer
  //         }
  //     }
  //   }, 


  // // this begins a next section

  // // Do you have coarse, dark hairs on your face?
  // q52:{
  //   options: [1,0,999,777],

  //   nextQuestion: function(){
  //     var answer = this.answer
  //         return 'q53'

  //       },
  //       ranking: function(){
  //       var answer = this.answer
  //         }
  //     }
  //   },     


  // // Do you take dietary supplements or prescription medications regularly?
  // q53:{
  //   options: [1,0,999,777],

  //   nextQuestion: function(){
  //     var answer = this.answer
  //       if(answer == 1)
  //         return 'q53a'
  //       else
  //         return 'q54a'

  //       },
  //       ranking: function(){
  //       var answer = this.answer
  //         }
  //     }
  //   }, 

  // // Do you take St. John's wort?
  // q53a:{
  //   options: [1,0,999,777,888],

  //   nextQuestion: function(){
  //     var answer = this.answer
  //         return 'q53b'

  //       },
  //       ranking: function(){
  //       var answer = this.answer
  //         }
  //     }
  //   }, 

  // // Do you take Rifampin, Rihadin or Rinactana?
  // q53b:{
  //   options: [1,0,999,777,888],

  //   nextQuestion: function(){
  //     var answer = this.answer
  //         return 'q53c'

  //       },
  //       ranking: function(){
  //       var answer = this.answer
  //         }
  //     }
  //   },

  // // Do you take Phinanytoin or Dilantin?
  // q53c:{
  //   options: [1,0,999,777,888],

  //   nextQuestion: function(){
  //     var answer = this.answer
  //         return 'q53d'

  //       },
  //       ranking: function(){
  //       var answer = this.answer
  //         }
  //     }
  //   },

  // // Do you take Carbamazepine or Tegretol?
  // q53d:{
  //   options: [1,0,999,777,888],

  //   nextQuestion: function(){
  //     var answer = this.answer
  //         return 'q53e'

  //       },
  //       ranking: function(){
  //       var answer = this.answer
  //         }
  //     }
  //   },

  // // Do you take Primadone or Mysoline?
  // q53e:{
  //   options: [1,0,999,777,888],

  //   nextQuestion: function(){
  //     var answer = this.answer
  //         return 'q53f'

  //       },
  //       ranking: function(){
  //       var answer = this.answer
  //         }
  //     }
  //   },

  // // Do you take Topiramate or Topamax?
  // q53f:{
  //   options: [1,0,999,777,888],

  //   nextQuestion: function(){
  //     var answer = this.answer
  //         return 'q53g'

  //       },
  //       ranking: function(){
  //       var answer = this.answer
  //         }
  //     }
  //   },


  // // Do you take Oxycarbazepine or Trileptal?
  // q53g:{
  //   options: [1,0,999,777,888],

  //   nextQuestion: function(){
  //     var answer = this.answer
  //         return 'q53h'

  //       },
  //       ranking: function(){
  //       var answer = this.answer
  //         }
  //     }
  //   },


  // // Do you take Griseofulvin, Fulvicin or Grisactin?
  // q53h:{
  //   options: [1,0,999,777,888],

  //   nextQuestion: function(){
  //     var answer = this.answer
  //         return 'q54a'

  //       },
  //       ranking: function(){
  //       var answer = this.answer
  //         }
  //     }
  //   },

  // // The birth control pill requires that you take a pill every single day
  // // Could you remember to take a pill every single day?
  // q54a:{
  //   options: [1,0,999,777,888],

  //   nextQuestion: function(){
  //     var answer = this.answer
  //         return 'q54b'

  //       },
  //       ranking: function(){
  //       var answer = this.answer
  //         }
  //     }
  //   },

  // // The birth control shot requires that you return to the clinic every three months to get a
  // // shot, would you be able to do this?
  // q54b:{
  //   options: [1,0,999,777,888],

  //   nextQuestion: function(){
  //     var answer = this.answer
  //         return 'q54c'

  //       },
  //       ranking: function(){
  //       var answer = this.answer
  //         }
  //     }
  //   },

  // // The contraceptive ring requires that you place a small bendable ring in your vagina
  // // once per month. Would you feel comfortable using the ring as a birth control method?
  // q54c:{
  //   options: [1,0,999,777,888],

  //   nextQuestion: function(){
  //     var answer = this.answer
  //         return 'q54d'

  //       },
  //       ranking: function(){
  //       var answer = this.answer
  //         }
  //     }
  //   },

  // // Would you feel comfortable having an IUD, a T-shaped contracpetive, placed by your
  // // provider inside your uterus that would provide contracpetion for 5-10 years?
  // q54d:{
  //   options: [1,0,999,777,888],

  //   nextQuestion: function(){
  //     var answer = this.answer
  //         return 'q54e'

  //       },
  //       ranking: function(){
  //       var answer = this.answer
  //         }
  //     }
  //   },


  // // The contraceptive implant is a small rod placed by your provider under the
  // // sking of your upper arm that provides contracpetion for up to 3 years?
  // q54e:{
  //   options: [1,0,999,777,888],

  //   nextQuestion: function(){
  //     var answer = this.answer
  //         return ''

  //       },
  //       ranking: function(){
  //       var answer = this.answer
  //         }
  //     }
  //   },
       
    return {
      questions: questions,
      ranking: ranking,
      initRanking: initRanking,
      sectionEnd: sectionEnd,
      getRanking: function(){
        return ranking
      }

    }


  });

