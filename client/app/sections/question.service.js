'use strict';

/**
 * Factory for QuestionService
 * AngularJS will instantiate this singleton
 */
angular.module('contraceptionApp').factory('questionService', function () {

    /**
     * Values for each contraception type, updated by
     * answers to questions
     */
    var ranking = { };

    /**
     * The last question in each section
     */
    var sectionEnd = [
      'q3','q13','q22','q27','q52','q53h', 'q54e'
    ];




    /**
     * Initialize (zeroize) the rankings
     * Invoked at construction
     */
    function initRanking() {
      ranking = {
        abstinence : {n:0,p:0},
        ocp : {n:0,p:0},
        pop : {n:0,p:0},
        ortho_evra : {n:0,p:0},
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
      };
    }
    initRanking();

    /**
     * Global to hold problem list
     */
    var problems = {
      curBcProbNum : 0,
      bcProblemList : [],
      problemsPerBc : {},
    }

    var BirthControl = function (name) {
      this.name = name;
      this.n = 0;
      this.p = 0;
      this.neg = function(num) {
        console.log(this.name + " -> neg:" + num);
        this.n -= num;
      };
      this.pos = function(num) {
        console.log(this.name + " -> pos:" + num);
        this.p += num;
      };
      this.score = function() {
        return { 'p': this.p, 'n': this.n };
      };
      this.resetScore = function() {
        this.n = 0;
        this.p = 0;
      }
    }

    var Question = function(name) {
      this.name = name;
    }

    Question.prototype.scoreArgs = function(args) {
      // expecting args.value and args.optionList
      var foundValue = false;
      var foundOptions = false;

      console.log("proto.scoreArgs");
      if (typeof args != "undefined") {
        if (typeof args.value != "undefined") {
          console.log('proto.scoreArgs:value:', args.value);
          foundValue = true;
        }
        if (typeof args.optionList != "undefined") {
          console.log("proto.scoreArgs:optionList", args.optionList);
          foundOptions = true;
        }
      } else {
        console.log("proto.scoreArgs:undefined", this.name);
      }
      return {
            hasValue: foundValue,
            hasOptions: foundOptions
      };
    };

    Question.prototype.score = function(args) {
      console.log("proto.score", this.name);
      var argTypes = Question.prototype.scoreArgs.call(this, args);
      if (argTypes.hasValue) {
        console.log("proto.score:value", args.value);
      }
      if (argTypes.hasOptions) {
        console.log("proto.score:options", args.optionList);
      }
    };

    var Survey = {
      bcList : {
            'abstinence' : new BirthControl('abstinence'),
            'bf' : new BirthControl('bf'),
            'btl' : new BirthControl('btl'),
            'ccap' : new BirthControl('ccap'),
            'depo' : new BirthControl('depo'),
            'diaph' : new BirthControl('diaph'),
            'ec' : new BirthControl('ec'),
            'fam' : new BirthControl('fam'),
            'fcondom' : new BirthControl('fcondom'),
            'implanon' : new BirthControl('implanon'),
            'mcondom' : new BirthControl('mcondom'),
            'mirena' : new BirthControl('mirena'),
            'nuvaring' : new BirthControl('nuvaring'),
            'ocp' : new BirthControl('ocp'),
            'ortho_evra' : new BirthControl('ortho_evra'),
            'paragard' : new BirthControl('paragard'),
            'pop' : new BirthControl('pop'),
            'sperm' : new BirthControl('sperm'),
            'sponge' : new BirthControl('sponge'),
            'vas' : new BirthControl('vas'),
            'withd' : new BirthControl('withd'),
      },
      qList : {},
      answerList : {},
      score : function() {
        console.log("Survey.score");
        for (var key in this.qList) {
          if (this.qList.hasOwnProperty(key)) {
            console.log(key + " -> " + this.qList[key]);
            this.qList[key].score(this.answerList[key]);
          }
        }
      },
      resetScores : function() {
        console.log("Survey.resetScores");
        for (var key in this.bcList) {
          if (this.bcList.hasOwnProperty(key)) {
            this.bcList[key].resetScore();
          }
        }
      },
      results : function() {
        console.log("Survey.results");
        this.resetScores();
        this.score();
        var results = [];
        for (var key in this.bcList) {
          if (this.bcList.hasOwnProperty(key)) {
            var score = this.bcList[key].score();
            var result = { 'name': key, 'p': score.p, 'n': score.n };
            console.log(result);
            results.push(result);
          }
        }
        return results;
      },
      newQuestion : function(q) {
        console.log("Survey.newQuestion", q.name);
        this.qList[q.name] = q;
      },
      answer : function(qName, args) {
        console.log("Survey.answer", qName, args);
        this.answerList[qName] = args;


      },
      bcNeg: function(bcName, num) {
        this.bcList[bcName].neg(num);
      },
      bcPos: function(bcName, num) {
        this.bcList[bcName].pos(num);
      },
    }

    // Scoring for 'q1'
    var q1score = new Question('q1');
    q1score.score = function(args) {
      console.log("q1.score");
      var argTypes = Question.prototype.scoreArgs.call(this, args);
      if (argTypes.hasValue) {
        var age = args.value;
        console.log("q1 has value", args.value);
        if (age < 18) {
          Survey.bcNeg('vas', 999);
          Survey.bcNeg('btl', 999);
        } else {
          if (age < 21) {
            Survey.bcNeg('vas', 3);
            Survey.bcNeg('btl', 3);
          }
        }
      }
    };
    Survey.newQuestion(q1score);

    // Scoring for 'q2'
    var q2score = new Question('q2');
    q2score.score = function(args) {
      console.log("q2.score");
      var argTypes = Question.prototype.scoreArgs.call(this, args);
      if (argTypes.hasValue) {
        var weight = args.value;
        console.log("q2 has value", args.value);
        if(weight >= 200 && weight < 555){
          Survey.bcNeg('ortho_evra', 2);
        }
        if(weight >=250 && weight < 555){
          Survey.bcNeg('depo', 2);
        }
      }
    };
    Survey.newQuestion(q2score);


    // Scoring for 'q3'
    var q3score = new Question('q3');
    q3score.score = function(args) {
      console.log("q3.score");
      var argTypes = Question.prototype.scoreArgs.call(this, args);
      if (argTypes.hasValue) {
        var smoke = args.value;
        var age = Survey.answerList['q1'].value;
        console.log("q3 has value", args.value);
        if (smoke == 2 || smoke == 3) {
          if (age > 35 && age < 555) {
            Survey.bcNeg('ocp', 999);
            Survey.bcNeg('ortho_evra', 999);
            Survey.bcNeg('nuvaring', 999);
          }
        }
      }
    };
    Survey.newQuestion(q3score);

    // Scoring for 'q4'
    var q4score = new Question('q4');
    q4score.score = function(args) {
      console.log("q4.score");
      var argTypes = Question.prototype.scoreArgs.call(this, args);
      if (argTypes.hasValue) {
        var regPeriod = args.value;
        console.log("q4 has value", args.value);
        if (regPeriod == 2) {
            Survey.bcPos('ocp', 1);
            Survey.bcPos('nuvaring', 1);
            Survey.bcPos('ortho_evra', 1);
            Survey.bcNeg('fam', 3);
        }
      }
    };
    Survey.newQuestion(q4score);

    // Scoring for 'q4a'
    var q4ascore = new Question('q4a');
    q4ascore.score = function(args) {
      console.log("q4a.score");
      var argTypes = Question.prototype.scoreArgs.call(this, args);
      if (argTypes.hasValue) {
        var periodFrequency = args.value;
        console.log("q4a has value", args.value);
        if (periodFrequency == 1) {
            Survey.bcPos('ocp', 1);
            Survey.bcPos('pop', 1);
            Survey.bcPos('ortho_evra', 1);
            Survey.bcPos('nuvaring', 1);
            Survey.bcPos('depo', 1);
            Survey.bcPos('mirena', 1);
            Survey.bcNeg('fam', 3);
            Survey.bcPos('implanon', 1);
        }
      }
    };
    Survey.newQuestion(q4ascore);


    // Scoring for 'q5'
    var q5score = new Question('q5');
    q5score.score = function(args) {
      console.log("q5.score");
      var argTypes = Question.prototype.scoreArgs.call(this, args);
      if (argTypes.hasValue) {
        var heavyPeriod = args.value;
        console.log("q5 has value", args.value);
        if (heavyPeriod == 1) {
            Survey.bcPos('ocp', 1);
            Survey.bcPos('pop', 1);
            Survey.bcPos('ortho_evra', 1);
            Survey.bcPos('nuvaring', 1);
            Survey.bcPos('depo', 1);
            Survey.bcPos('mirena', 1);
            Survey.bcPos('implanon', 1);
            Survey.bcNeg('paragard', 2);
        }
      }
    };
    Survey.newQuestion(q5score);

    // Scoring for 'q6'
    var q6score = new Question('q6');
    q6score.score = function(args) {
      console.log("q6.score");
      var argTypes = Question.prototype.scoreArgs.call(this, args);
      if (argTypes.hasValue) {
        var period7days = args.value;
        console.log("q6 has value", args.value);
        if (period7days == 1) {
            Survey.bcPos('ocp', 1);
            Survey.bcPos('pop', 1);
            Survey.bcPos('ortho_evra', 1);
            Survey.bcPos('nuvaring', 1);
            Survey.bcPos('depo', 1);
            Survey.bcPos('mirena', 1);
            Survey.bcPos('implanon', 1);
        }
      }
    };
    Survey.newQuestion(q6score);

    // Scoring for 'q7'
    var q7score = new Question('q7');
    q7score.score = function(args) {
      console.log("q7.score");
      var argTypes = Question.prototype.scoreArgs.call(this, args);
      if (argTypes.hasValue) {
        var cramps = args.value;
        console.log("q7 has value", args.value);
        if (cramps == 1) {
            Survey.bcPos('ocp', 1);
            Survey.bcPos('pop', 1);
            Survey.bcPos('ortho_evra', 1);
            Survey.bcPos('nuvaring', 1);
            Survey.bcPos('depo', 1);
            Survey.bcNeg('paragard', 2);
            Survey.bcPos('mirena', 1);
            Survey.bcPos('implanon', 1);
        }
      }
    };
    Survey.newQuestion(q7score);

    // Scoring for 'q8'
    var q8score = new Question('q8');
    q8score.score = function(args) {
      console.log("q8.score");
      var argTypes = Question.prototype.scoreArgs.call(this, args);
      if (argTypes.hasValue) {
        var tenderBreasts = args.value;
        console.log("q8 has value", args.value);
        if (tenderBreasts == 1) {
            Survey.bcPos('pop', 1);
            Survey.bcNeg('ortho_evra', 3);
            Survey.bcPos('nuvaring', 1);
            Survey.bcPos('depo', 1);
            Survey.bcPos('mirena', 1);
            Survey.bcPos('implanon', 1);
        }
      }
    };
    Survey.newQuestion(q8score);

    // Scoring for 'q9'
    var q9score = new Question('q9');
    q9score.score = function(args) {
      console.log("q9.score");
      var argTypes = Question.prototype.scoreArgs.call(this, args);
      if (argTypes.hasValue) {
        var depression = args.value;
        console.log("q9 has value", args.value);
        if (depression == 1) {
            Survey.bcPos('ocp', 1);
            Survey.bcPos('pop', 1);
            Survey.bcPos('ortho_evra', 1);
            Survey.bcPos('nuvaring', 1);
            Survey.bcPos('depo', 1);
            Survey.bcPos('mirena', 1);
            Survey.bcPos('implanon', 1);
        }
      }
    };
    Survey.newQuestion(q9score);

    // Scoring for 'q10'
    var q10score = new Question('q10');
    q10score.score = function(args) {
      console.log("q10.score");
      var argTypes = Question.prototype.scoreArgs.call(this, args);
      if (argTypes.hasValue) {
        var bloating = args.value;
        console.log("q10 has value", args.value);
        if (bloating == 1) {
            Survey.bcPos('ocp', 1);
            Survey.bcPos('pop', 1);
            Survey.bcPos('ortho_evra', 1);
            Survey.bcPos('nuvaring', 1);
            Survey.bcPos('depo', 1);
            Survey.bcPos('mirena', 1);
            Survey.bcPos('implanon', 1);
        }
      }
    };
    Survey.newQuestion(q10score);

    // Scoring for 'q11'
    var q11score = new Question('q11');
    q11score.score = function(args) {
      console.log("q11.score");
      var argTypes = Question.prototype.scoreArgs.call(this, args);
      if (argTypes.hasValue) {
        var headaches = args.value;
        console.log("q11 has value", args.value);
        if (headaches == 1) {
            Survey.bcPos('pop', 1);
            Survey.bcPos('depo', 1);
            Survey.bcPos('mirena', 1);
            Survey.bcPos('implanon', 1);
        }
      }
    };
    Survey.newQuestion(q11score);

    // Scoring for 'q12'
    var q12score = new Question('q12');
    q12score.score = function(args) {
      console.log("q12.score");
      var argTypes = Question.prototype.scoreArgs.call(this, args);
      if (argTypes.hasValue) {
        var pms = args.value;
        console.log("q12 has value", args.value);
        if (pms == 1) {
            Survey.bcPos('ocp', 1);
            Survey.bcPos('pop', 1);
            Survey.bcPos('ortho_evra', 1);
            Survey.bcPos('nuvaring', 1);
            Survey.bcPos('depo', 1);
            Survey.bcPos('mirena', 1);
            Survey.bcPos('implanon', 1);
        }
      }
    };
    Survey.newQuestion(q12score);

    // Scoring for 'q13'
    var q13score = new Question('q13');
    q13score.score = function(args) {
      console.log("q13.score");
      var argTypes = Question.prototype.scoreArgs.call(this, args);
      if (argTypes.hasValue) {
        var missSchoolWork = args.value;
        console.log("q13 has value", args.value);
        if (missSchoolWork == 1) {
            Survey.bcPos('ocp', 1);
            Survey.bcPos('pop', 1);
            Survey.bcPos('ortho_evra', 1);
            Survey.bcPos('nuvaring', 1);
            Survey.bcPos('depo', 1);
            Survey.bcPos('mirena', 1);
            Survey.bcPos('implanon', 1);
        }
        if (missSchoolWork == 2) {
            Survey.bcPos('ocp', 1);
            Survey.bcPos('pop', 1);
            Survey.bcPos('ortho_evra', 1);
            Survey.bcPos('nuvaring', 1);
            Survey.bcPos('depo', 1);
            Survey.bcPos('mirena', 1);
            Survey.bcPos('implanon', 1);
        }
      }
    };
    Survey.newQuestion(q13score);

    // Scoring for 'q14'
    var q14score = new Question('q14');
    q14score.score = function(args) {
      console.log("q14.score");
      var argTypes = Question.prototype.scoreArgs.call(this, args);
      if (argTypes.hasValue) {
        var sexualRel = args.value;
        console.log("q14 has value", args.value);
        if (sexualRel == 1 || sexualRel == 2) {
            Survey.bcNeg('paragard', 1);
            Survey.bcNeg('mirena', 1);
        }
      }
    };
    Survey.newQuestion(q14score);

    // Scoring for 'q15'
    var q15score = new Question('q15');
    q15score.score = function(args) {
      console.log("q15.score");
      var argTypes = Question.prototype.scoreArgs.call(this, args);
      if (argTypes.hasValue) {
        var vaginalSexCount = args.value;
        console.log("q15 has value", args.value);
        if (vaginalSexCount > 10 && vaginalSexCount < 555) {
            Survey.bcNeg('paragard', 999);
            Survey.bcNeg('mirena', 999);
        }
      }
    };
    Survey.newQuestion(q15score);

    // Scoring for 'q16bi'
    var q16biscore = new Question('q16bi');
    q16biscore.score = function(args) {
      console.log("q16bi.score");
      var argTypes = Question.prototype.scoreArgs.call(this, args);
      if (argTypes.hasOptions) {
        var bcList = args.optionList;
        var len = bcList.length;
        for (var i = bcList.length - 1; i >= 0; i--) {
          var bc = bcList[i].value
          switch (bc)
          {
            // Birth Control
            case 1:
              Survey.bcNeg('ocp', 3);
              Survey.bcNeg('pop', 2);
              break;
            // Mini Pills
            case 2:
              Survey.bcNeg('ocp', 2);
              Survey.bcNeg('pop', 3);
              break;
            // Ortho Evra
            case 3:
              Survey.bcNeg('ortho_evra', 3);
              break;
            // Nuva Ring
            case 4:
              Survey.bcNeg('nuvaring', 3);
              break;
            // Depo
            case 5:
              Survey.bcNeg('depo', 3);
              break;
            // Male Condom
            case 6:
              Survey.bcNeg('mcondom', 3);
              break;
            // Diaphram, Female Condom, Sponge
            case 7:
            case 8:
            case 9:
              Survey.bcNeg('diaph', 3);
              Survey.bcNeg('fcondom', 3);
              Survey.bcNeg('ccap', 3);
              Survey.bcNeg('sponge', 3);
              break;
            // Fam
            case 10:
              Survey.bcNeg('fam', 3);
              break;
            // EC / PlanB
            case 11:
              Survey.bcNeg('ec', 3);
              break;
            // IUD / Paragard, Mirena
            case 12:
            case 13:
              Survey.bcNeg('paragard', 3);
              Survey.bcNeg('mirena', 3);
              break;
            // Withdrawal
            case 14:
              Survey.bcNeg('withd', 3);
              break;
            // Spermicide
            case 15:
              Survey.bcNeg('sperm', 3);
              break;
            // BTL / Tubes Tied
            case 16:
              Survey.bcNeg('btl', 3);
              break;
            // Vasectomy
            case 17:
              Survey.bcNeg('vas', 3);
              break;
            // Implant
            case 18:
              Survey.bcNeg('implanon', 3);
              break;
            // Breast Feeding
            case 19:
              Survey.bcNeg('bf', 3);
              break;
            // Abstinence
            case 20:
              Survey.bcNeg('abstinence', 3);
              break;
          }
        }
      }
    };
    Survey.newQuestion(q16biscore);

    // Scoring for 'q17'
    var q17score = new Question('q17');
    q17score.score = function(args) {
      console.log("q17.score");
      var argTypes = Question.prototype.scoreArgs.call(this, args);
      if (argTypes.hasOptions) {
        var bcList = args.optionList;
        var len = bcList.length;
        for (var i = bcList.length - 1; i >= 0; i--) {
          var bc = bcList[i].value
          switch (bc)
          {
            // Abstinence
            case 1:
              Survey.bcPos('abstinence', 1);
              break;
            // Birth Control
            case 2:
              Survey.bcPos('ocp', 1);
              Survey.bcPos('pop', 1);
              break;
            // Mini Pills
            case 3:
              Survey.bcPos('ocp', 1);
              Survey.bcPos('pop', 1);
              break;
            // Ortho Evra
            case 4:
              Survey.bcPos('ortho_evra', 1);
              break;
            // Nuva Ring
            case 5:
              Survey.bcPos('nuvaring', 1);
              break;
            // Depo
            case 6:
              Survey.bcPos('depo', 1);
              break;
            // Male Condom
            case 7:
              Survey.bcPos('mcondom', 1);
              break;
            // Diaphram
            case 8:
              Survey.bcPos('diaph', 1);
              break;
            // Female Condom
            case 9:
              Survey.bcPos('fcondom', 1);
              break;
            // Sponge
            case 10:
              Survey.bcPos('sponge', 1);
              break;
            // Fam
            case 11:
              Survey.bcPos('fam', 1);
              break;
            // EC / PlanB
            case 12:
              Survey.bcPos('ec', 1);
              break;
            // Paragard
            case 13:
              Survey.bcPos('paragard', 1);
              break;
            // Mirena
            case 14:
              Survey.bcPos('mirena', 1);
              break;
            // Withdrawal
            case 15:
              Survey.bcPos('withd', 1);
              break;
            // Spermicide
            case 16:
              Survey.bcPos('sperm', 1);
              break;
            // BTL / Tubes Tied
            case 17:
              Survey.bcPos('btl', 1);
              break;
            // Vasectomy
            case 18:
              Survey.bcPos('vas', 1);
              break;
            // Implant
            case 19:
              Survey.bcPos('implanon', 1);
              break;
            // Breast Feeding
            case 20:
              Survey.bcPos('bf', 1);
              break;
          }
        }
      }
    };
    Survey.newQuestion(q17score);

    // Scoring for 'q18ai'
    var q18aiscore = new Question('q18ai');
    q18aiscore.score = function(args) {
      console.log("q18ai.score");
      var argTypes = Question.prototype.scoreArgs.call(this, args);
      if (argTypes.hasOptions) {
        var bcList = args.optionList;
        var len = bcList.length;
        for (var i = bcList.length - 1; i >= 0; i--) {
          var bc = bcList[i].value
          switch (bc)
          {
            // Abstinence
            case 1:
              Survey.bcPos('abstinence', 1);
              break;
            // Birth Control
            case 2:
              Survey.bcPos('ocp', 1);
              break;
            // Mini Pills
            case 3:
              Survey.bcPos('pop', 1);
              break;
            // Ortho Evra
            case 4:
              Survey.bcPos('ortho_evra', 1);
              break;
            // Nuva Ring
            case 5:
              Survey.bcPos('nuvaring', 1);
              break;
            // Depo
            case 6:
              Survey.bcPos('depo', 1);
              break;
            // Male Condom
            case 7:
              Survey.bcPos('mcondom', 1);
              break;
            // Diaphram
            case 8:
              Survey.bcPos('diaph', 1);
              break;
            // Female Condom
            case 9:
              Survey.bcPos('fcondom', 1);
              break;
            // Sponge
            case 10:
              Survey.bcPos('sponge', 1);
              break;
            // Fam
            case 11:
              Survey.bcPos('fam', 1);
              break;
            // EC / PlanB
            case 12:
              Survey.bcPos('ec', 1);
              break;
            // Paragard
            case 13:
              Survey.bcPos('paragard', 1);
              break;
            // Mirena
            case 14:
              Survey.bcPos('mirena', 1);
              break;
            // Withdrawal
            case 15:
              Survey.bcPos('withd', 1);
              break;
            // Spermicide
            case 16:
              Survey.bcPos('sperm', 1);
              break;
            // BTL / Tubes Tied
            case 17:
              Survey.bcPos('btl', 1);
              break;
            // Vasectomy
            case 18:
              Survey.bcPos('vas', 1);
              break;
            // Implant
            case 19:
              Survey.bcPos('implanon', 1);
              break;
            // Breast Feeding
            case 20:
              Survey.bcPos('bf', 1);
              break;
          }
        }
      }
    };
    Survey.newQuestion(q18aiscore);

    // Scoring for 'q19ai'
    var q19aiscore = new Question('q19ai');
    q19aiscore.ocp = function(prob) {
      switch (prob)
      {
          // Breast Tenderness
          case 1:
            Survey.bcNeg('ocp', 1);
            Survey.bcNeg('ortho_evra', 3);
            break;
          // Cramping or pain
          case 2:
            break;
          // Hair Loss
          case 3:
            Survey.bcNeg('ocp', 2);
            break;
          // Depression or mood swings
          case 4:
            Survey.bcNeg('ocp', 1);
            break;
          // Nausea or vomiting
          case 5:
            Survey.bcNeg('ocp', 2);
            Survey.bcNeg('ortho_evra', 1);
            break;
          // Weight gain
          case 6:
            Survey.bcNeg('ocp', 1);
            Survey.bcNeg('depo', 3);
            break;
          // Migraines or very bad headaches
          case 7:
            Survey.bcNeg('ocp', 2);
            Survey.bcNeg('ortho_evra', 2);
            Survey.bcNeg('nuvaring', 1);
            break;
          // Discharge
          case 8:
            break;
          // Other changes to my body
          case 9:
            break;
          // "I couldn't get to the clinic
          case 10:
            Survey.bcNeg('ocp', 2);
            Survey.bcNeg('pop', 2);
            Survey.bcNeg('ortho_evra', 2);
            Survey.bcNeg('nuvaring', 2);
            Survey.bcNeg('depo', 3);
            Survey.bcPos('paragard', 1);
            Survey.bcPos('mirena', 1);
            Survey.bcPos('btl', 1);
            Survey.bcPos('vas', 1);
            Survey.bcPos('implanon', 1);
            break;
          // "I couldn't get to the pharmacy
          case 11:
            Survey.bcNeg('ocp', 2);
            Survey.bcNeg('pop', 2);
            Survey.bcNeg('ortho_evra', 2);
            Survey.bcNeg('nuvaring', 2);
            //Survey.bcNeg('depo', 3);
            Survey.bcPos('paragard', 1);
            Survey.bcPos('mirena', 1);
            Survey.bcPos('btl', 1);
            Survey.bcPos('vas', 1);
            Survey.bcPos('implanon', 1);
            break;
          // "It was too expensive
          case 12:
            Survey.bcNeg('ocp', 1);
            break;
          // "I had another problem getting the birth control
          case 13:
            break;
          // "I forgot to take it or missed too many doses
          case 14:
            Survey.bcNeg('ocp', 2);
            Survey.bcNeg('pop', 2);
            Survey.bcPos('nuvaring', 1);
            Survey.bcPos('depo', 1);
            Survey.bcPos('paragard', 1);
            Survey.bcPos('mirena', 1);
            Survey.bcPos('btl', 1);
            Survey.bcPos('vas', 1);
            Survey.bcPos('implanon', 1);
            break;
          // "I failed to restart after break for period
          case 15:
            Survey.bcNeg('ocp', 2);
            Survey.bcNeg('ortho_evra', 1);
            Survey.bcNeg('nuvaring', 1);
            Survey.bcPos('depo', 1);
            Survey.bcPos('paragard', 1);
            Survey.bcPos('mirena', 1);
            Survey.bcPos('btl', 1);
            Survey.bcPos('vas', 1);
            Survey.bcPos('implanon', 1);
            break;
          // "I didn't use it every time I had sex
          case 16:
            break;
          // "I had another problem using it correctly
          case 17:
            Survey.bcNeg('ocp', 3);
            Survey.bcNeg('pop', 2);
            break;
          // "I got pregnant
          //CONFIRM ABSTINENCE SCORING GOES BELOW
          case 18:
            Survey.bcNeg('abstinence', 3);
            break;
          // "High blood pressure
          case 19:
            Survey.bcNeg('ocp', 2);
            Survey.bcNeg('ortho_evra', 999);
            Survey.bcNeg('nuvaring', 999);
            break;
          // "Blood clot in vein or lungs
          case 20:
            Survey.bcNeg('ocp', 999);
            Survey.bcNeg('ortho_evra', 999);
            Survey.bcNeg('nuvaring', 999);
            break;
          // "Stroke or heart attack
          case 21:
            Survey.bcNeg('ocp', 999);
            Survey.bcNeg('depo', 999);
            Survey.bcNeg('ortho_evra', 999);
            Survey.bcNeg('nuvaring', 999);
            break;
          // "Another health problem
          case 22:
            break;
          // "I didn't like the prolonged breathing
          case 23:
            Survey.bcNeg('ocp', 1);
            break;
          // "I didn't like the heavy bleeding
          case 24:
            break;
          // "I didn't like the irregular bleeding
          case 25:
            Survey.bcNeg('ocp', 1);
            break;
          // "I didn't like the absence of bleeding
          case 26:
            Survey.bcNeg('ocp', 1);
            Survey.bcNeg('depo', 1);
            break;
          // "I didn't like something else about my periods
          case 27:
            break;
          // "My partner didn't like it
          case 28:
            Survey.bcNeg('ocp', 1);
            break;
      }
    };

    // score.pop
    q19aiscore.minipills = function(prob) {
      switch (prob)
      {
          // Breast Tenderness
          case 1:
            break;
          // Cramping or pain
          case 2:
            break;
          // Hair Loss
          case 3:
            Survey.bcNeg('pop', 1);
            break;
          // Depression or mood swings
          case 4:
            break;
          // Nausea or vomiting
          case 5:
            break;
          // Weight gain
          case 6:
            break;
          // Migraines or very bad headaches
          case 7:
            Survey.bcNeg('pop', 1);
            break;
          // Discharge
          case 8:
            break;
          // Other changes to my body
          case 9:
            break;
          // "I couldn't get to the clinic
          case 10:
            Survey.bcNeg('ocp', 2);
            Survey.bcNeg('pop', 2);
            Survey.bcNeg('ortho_evra', 2);
            Survey.bcNeg('nuvaring', 2);
            Survey.bcNeg('depo', 3);
            Survey.bcPos('paragard', 1);
            Survey.bcPos('mirena', 1);
            Survey.bcPos('btl', 1);
            Survey.bcPos('vas', 1);
            Survey.bcPos('implanon', 1);
            break;
          // "I couldn't get to the pharmacy
          case 11:
            Survey.bcNeg('ocp', 2);
            Survey.bcNeg('pop', 2);
            Survey.bcNeg('ortho_evra', 2);
            Survey.bcNeg('nuvaring', 2);
            //Survey.bcNeg('depo', 3);
            Survey.bcPos('paragard', 1);
            Survey.bcPos('mirena', 1);
            Survey.bcPos('btl', 1);
            Survey.bcPos('vas', 1);
            Survey.bcPos('implanon', 1);
            break;
          // "It was too expensive
          case 12:
            Survey.bcNeg('pop', 1);
            break;
          // "I had another problem getting the birth control
          case 13:
            break;
          // "I forgot to take it or missed too many doses
          case 14:
            Survey.bcNeg('ocp', 2);
            Survey.bcNeg('pop', 2);
            Survey.bcPos('nuvaring', 1);
            Survey.bcPos('depo', 1);
            Survey.bcPos('paragard', 1);
            Survey.bcPos('mirena', 1);
            Survey.bcPos('btl', 1);
            Survey.bcPos('vas', 1);
            Survey.bcPos('implanon', 1);
            break;
          // "I failed to restart after break for period
          case 15:
            break;
          // "I didn't use it every time I had sex
          case 16:
            break;
          // "I had another problem using it correctly
          case 17:
            break;
          // "I got pregnant
          case 18:
            Survey.bcNeg('ocp', 2);
            Survey.bcNeg('pop', 3);
            break;
          // "High blood pressure
          case 19:
              Survey.bcNeg('ocp', 999);
              Survey.bcNeg('ortho_evra', 999);
              Survey.bcNeg('nuvaring', 999);
            break;
          // "Blood clot in vein or lungs
          case 20:
            Survey.bcNeg('ocp', 999);
            Survey.bcNeg('ortho_evra', 999);
            Survey.bcNeg('nuvaring', 999);
            break;
          // "Stroke or heart attack
          case 21:
            Survey.bcNeg('ocp', 999);
            Survey.bcNeg('depo', 999);
            Survey.bcNeg('ortho_evra', 999);
            Survey.bcNeg('nuvaring', 999);
            Survey.bcNeg('pop', 999);
            break;
          // "Another health problem
          case 22:
            break;
          // "I didn't like the prolonged breathing
          case 23:
            Survey.bcNeg('pop', 1);
            break;
          // "I didn't like the heavy bleeding
          case 24:
            break;
          // "I didn't like the irregular bleeding
          case 25:
            Survey.bcNeg('pop', 1);
            break;
          // "I didn't like the absence of bleeding
          case 26:
            Survey.bcNeg('pop', 1);
            Survey.bcNeg('depo', 1);
            break;
          // "I didn't like something else about my periods
          case 27:
            break;
          // "My partner didn't like it
          case 28:
            Survey.bcNeg('pop', 1);
            break;
      }
    };

    q19aiscore.ortho_evra = function(prob) {
      switch (prob)
      {
          // Breast Tenderness
          case 1:
             Survey.bcNeg('ortho_evra', 3);
            break;
          // Cramping or pain
          case 2:
            break;
          // Hair Loss
          case 3:
            break;
          // Depression or mood swings
          case 4:
            Survey.bcNeg('ortho_evra', 1);
            break;
          // Nausea or vomiting
          case 5:
            Survey.bcNeg('ortho_evra', 2);
            break;
          // Weight gain
          case 6:
            Survey.bcNeg('ortho_evra', 1);
            Survey.bcNeg('depo', 3);
            break;
          // Migraines or very bad headaches
          case 7:
            Survey.bcNeg('ortho_evra', 3);
            break;
          // Discharge
          case 8:
            break;
          // Other changes to my body
          case 9:
            break;
          // "I couldn't get to the clinic
          case 10:
            Survey.bcNeg('ocp', 2);
            Survey.bcNeg('pop', 2);
            Survey.bcNeg('ortho_evra', 2);
            Survey.bcNeg('nuvaring', 2);
            Survey.bcNeg('depo', 3);
            Survey.bcPos('paragard', 1);
            Survey.bcPos('mirena', 1);
            Survey.bcPos('btl', 1);
            Survey.bcPos('vas', 1);
            Survey.bcPos('implanon', 1);
            break;
          // "I couldn't get to the pharmacy
          case 11:
            Survey.bcNeg('ocp', 2);
            Survey.bcNeg('pop', 2);
            Survey.bcNeg('ortho_evra', 2);
            Survey.bcNeg('nuvaring', 2);
            //Survey.bcNeg('depo', 3);
            Survey.bcPos('paragard', 1);
            Survey.bcPos('mirena', 1);
            Survey.bcPos('btl', 1);
            Survey.bcPos('vas', 1);
            Survey.bcPos('implanon', 1);
            break;
          // "It was too expensive
          case 12:
            Survey.bcNeg('ortho_evra', 2);
            break;
          // "I had another problem getting the birth control
          case 13:
            break;
          // "I forgot to take it or missed too many doses
          case 14:
            Survey.bcNeg('ortho_evra', 2);
            break;
          // "I failed to restart after break for period
          case 15:
            Survey.bcNeg('ocp', 1);
            Survey.bcNeg('ortho_evra', 2);
            Survey.bcNeg('nuvaring', 1);
            Survey.bcPos('depo', 1);
            Survey.bcPos('paragard', 1);
            Survey.bcPos('mirena', 1);
            Survey.bcPos('btl', 1);
            Survey.bcPos('vas', 1);
            Survey.bcPos('implanon', 1);
            break;
          // "I didn't use it every time I had sex
          case 16:
            break;
          // "I had another problem using it correctly
          case 17:
            break;
          // "I got pregnant
          case 18:
            Survey.bcNeg('ortho_evra', 3);
            break;
          // "High blood pressure
          case 19:
            Survey.bcNeg('ocp', 999);
            Survey.bcNeg('ortho_evra', 999);
            Survey.bcNeg('nuvaring', 999);
            break;
          // "Blood clot in vein or lungs
          case 20:
            Survey.bcNeg('ocp', 999);
            Survey.bcNeg('ortho_evra', 999);
            Survey.bcNeg('nuvaring', 999);
            break;
          // "Stroke or heart attack
          case 21:
            Survey.bcNeg('ocp', 999);
            Survey.bcNeg('depo', 999);
            Survey.bcNeg('ortho_evra', 999);
            Survey.bcNeg('nuvaring', 999);
            break;
          // "Another health problem
          case 22:
            break;
          // "I didn't like the prolonged breathing
          case 23:
            break;
          // "I didn't like the heavy bleeding
          case 24:
            Survey.bcNeg('ortho_evra', 1);
            break;
          // "I didn't like the irregular bleeding
          case 25:
            Survey.bcNeg('ortho_evra', 1);
            Survey.bcNeg('depo', 2);
            break;
          // "I didn't like the absence of bleeding
          case 26:
            Survey.bcNeg('ortho_evra', 1);
            Survey.bcNeg('depo', 2);
            break;
          // "I didn't like something else about my periods
          case 27:
            break;
          // "My partner didn't like it
          case 28:
            Survey.bcNeg('ortho_evra', 2);
            break;
      }
    };

    q19aiscore.nuvaring = function(prob) {
      switch (prob)
      {
          // Breast Tenderness
          case 1:
              Survey.bcNeg('ocp', 1);
              Survey.bcNeg('ortho_evra', 3);
              Survey.bcNeg('nuvaring', 1);
            break;
          // Cramping or pain
          case 2:
            break;
          // Hair Loss
          case 3:
            Survey.bcNeg('nuvaring', 1);
            break;
          // Depression or mood swings
          case 4:
            Survey.bcNeg('nuvaring', 1);
            break;
          // Nausea or vomiting
          case 5:
            Survey.bcNeg('ortho_evra', 1);
            Survey.bcNeg('nuvaring', 1);
            break;
          // Weight gain
          case 6:
            Survey.bcNeg('nuvaring', 1);
            Survey.bcNeg('depo', 3);
            break;
          // Migraines or very bad headaches
          case 7:
            Survey.bcNeg('nuvaring', 1);
            break;
          // Discharge
          case 8:
            Survey.bcNeg('nuvaring', 3);
            break;
          // Other changes to my body
          case 9:
            break;
          // "I couldn't get to the clinic
          case 10:
            Survey.bcNeg('ocp', 2);
            Survey.bcNeg('pop', 2);
            Survey.bcNeg('ortho_evra', 2);
            Survey.bcNeg('nuvaring', 2);
            Survey.bcNeg('depo', 3);
            Survey.bcPos('paragard', 1);
            Survey.bcPos('mirena', 1);
            Survey.bcPos('btl', 1);
            Survey.bcPos('vas', 1);
            Survey.bcPos('implanon', 1);
            break;
          // "I couldn't get to the pharmacy
          case 11:
            Survey.bcNeg('ocp', 2);
            Survey.bcNeg('pop', 2);
            Survey.bcNeg('ortho_evra', 2);
            Survey.bcNeg('nuvaring', 2);
            //Survey.bcNeg('depo', 3);
            Survey.bcPos('paragard', 1);
            Survey.bcPos('mirena', 1);
            Survey.bcPos('btl', 1);
            Survey.bcPos('vas', 1);
            Survey.bcPos('implanon', 1);
            break;
          // "It was too expensive
          case 12:
            Survey.bcNeg('nuvaring', 1);
            break;
          // "I had another problem getting the birth control
          case 13:
            break;
          // "I forgot to take it or missed too many doses
          case 14:
            Survey.bcNeg('nuvaring', 1);
            break;
          // "I failed to restart after break for period
          case 15:
            Survey.bcNeg('ocp', 1);
            Survey.bcNeg('ortho_evra', 2);
            Survey.bcNeg('nuvaring', 2);
            Survey.bcPos('paragard', 1);
            Survey.bcPos('mirena', 1);
            Survey.bcPos('btl', 1);
            Survey.bcPos('vas', 1);
            Survey.bcPos('implanon', 1);
            break;
          // "I didn't use it every time I had sex
          case 16:
            break;
          // "I had another problem using it correctly
          case 17:
            break;
          // "I got pregnant
          case 18:
            Survey.bcNeg('nuvaring', 3);
            break;
          // "High blood pressure
          case 19:
              Survey.bcNeg('ocp', 999);
              Survey.bcNeg('ortho_evra', 999);
              Survey.bcNeg('nuvaring', 999);
            break;
          // "Blood clot in vein or lungs
          case 20:
            Survey.bcNeg('ocp', 999);
            Survey.bcNeg('ortho_evra', 999);
            Survey.bcNeg('nuvaring', 999);
            break;
          // "Stroke or heart attack
          case 21:
            Survey.bcNeg('ocp', 999);
            Survey.bcNeg('depo', 999);
            Survey.bcNeg('ortho_evra', 999);
            Survey.bcNeg('nuvaring', 999);
            break;
          // "Another health problem
          case 22:
            break;
          // "I didn't like the prolonged breathing
          case 23:
            Survey.bcNeg('nuvaring', 1);
            break;
          // "I didn't like the heavy bleeding
          case 24:
            Survey.bcNeg('nuvaring', 1);
            break;
          // "I didn't like the irregular bleeding
          case 25:
            Survey.bcNeg('nuvaring', 1);
            Survey.bcNeg('depo', 1);
            break;
          // "I didn't like the absence of bleeding
          case 26:
            Survey.bcNeg('nuvaring', 1);
            Survey.bcNeg('depo', 2);
            break;
          // "I didn't like something else about my periods
          case 27:
            break;
          // "My partner didn't like it
          case 28:
            Survey.bcNeg('nuvaring', 1);
            break;
      }
    };

    q19aiscore.depo = function(prob) {
      switch (prob)
      {
          // Breast Tenderness
          case 1:
            break;
          // Cramping or pain
          case 2:
            break;
          // Hair Loss
          case 3:
            Survey.bcNeg('depo', 2);
            break;
          // Depression or mood swings
          case 4:
            Survey.bcNeg('depo', 2);
            break;
          // Nausea or vomiting
          case 5:
            break;
          // Weight gain
          case 6:
            Survey.bcNeg('depo', 3);
            break;
          // Migraines or very bad headaches
          case 7:
            Survey.bcNeg('depo', 2);
            break;
          // Discharge
          case 8:
            break;
          // Other changes to my body
          case 9:
            break;
          // "I couldn't get to the clinic
          case 10:
            Survey.bcNeg('ocp', 2);
            Survey.bcNeg('pop', 2);
            Survey.bcNeg('ortho_evra', 2);
            Survey.bcNeg('nuvaring', 2);
            Survey.bcNeg('depo', 3);
            Survey.bcPos('paragard', 1);
            Survey.bcPos('mirena', 1);
            Survey.bcPos('btl', 1);
            Survey.bcPos('vas', 1);
            Survey.bcPos('implanon', 1);
            break;
          // "I couldn't get to the pharmacy
          case 11:
            break;
          // "It was too expensive
          case 12:
            Survey.bcNeg('depo', 1);
            break;
          // "I had another problem getting the birth control
          case 13:
            break;
          // "I forgot to take it or missed too many doses
          case 14:
            Survey.bcNeg('depo', 2);
            break;
          // "I failed to restart after break for period
          case 15:
            break;
          // "I didn't use it every time I had sex
          case 16:
            break;
          // "I had another problem using it correctly
          case 17:
            break;
          // "I got pregnant
          case 18:
            Survey.bcNeg('depo', 3);
            break;
          // "High blood pressure
          case 19:
              Survey.bcNeg('ocp', 999);
              Survey.bcNeg('ortho_evra', 999);
              Survey.bcNeg('nuvaring', 999);
            break;
          // "Blood clot in vein or lungs
          case 20:
            Survey.bcNeg('ocp', 999);
            Survey.bcNeg('ortho_evra', 999);
            Survey.bcNeg('nuvaring', 999);
            break;
          // "Stroke or heart attack
          case 21:
            Survey.bcNeg('ocp', 999);
            Survey.bcNeg('depo', 999);
            Survey.bcNeg('ortho_evra', 999);
            Survey.bcNeg('nuvaring', 999);
            break;
          // "Another health problem
          case 22:
            break;
          // "I didn't like the prolonged breathing
          case 23:
            Survey.bcPos('ocp', 1);
            Survey.bcPos('ortho_evra', 1);
            Survey.bcPos('nuvaring', 1);
            Survey.bcNeg('depo', 2);
            break;
          // "I didn't like the heavy bleeding
          case 24:
            Survey.bcNeg('depo', 1);
            break;
          // "I didn't like the irregular bleeding
          case 25:
            Survey.bcPos('ocp', 1);
            Survey.bcPos('ortho_evra', 1);
            Survey.bcPos('nuvaring', 1);
            Survey.bcNeg('depo', 2);
            break;
          // "I didn't like the absence of bleeding
          case 26:
            Survey.bcPos('ocp', 1);
            Survey.bcPos('ortho_evra', 1);
            Survey.bcPos('nuvaring', 1);
            Survey.bcNeg('depo', 2);
            break;
          // "I didn't like something else about my periods
          case 27:
            break;
          // "My partner didn't like it
          case 28:
            Survey.bcNeg('depo', 2);
            break;
      }
    };

    q19aiscore.mcondom = function(prob) {
      switch (prob)
      {
          // Breast Tenderness
          case 1:
            break;
          // Cramping or pain
          case 2:
            break;
          // Hair Loss
          case 3:
            break;
          // Depression or mood swings
          case 4:
            break;
          // Nausea or vomiting
          case 5:
            break;
          // Weight gain
          case 6:
            break;
          // Migraines or very bad headaches
          case 7:
            break;
          // Discharge
          case 8:
            break;
          // Other changes to my body
          case 9:
            break;
          // "I couldn't get to the clinic
          case 10:
            break;
          // "I couldn't get to the pharmacy
          case 11:
            break;
          // "It was too expensive
          case 12:
            Survey.bcNeg('mcondom', 1);
            break;
          // "I had another problem getting the birth control
          case 13:
            break;
          // "I forgot to take it or missed too many doses
          case 14:
            break;
          // "I failed to restart after break for period
          case 15:
            break;
          // "I didn't use it every time I had sex
          case 16:
            Survey.bcNeg('mcondom', 3);
            Survey.bcNeg('fcondom', 3);
            Survey.bcNeg('ccap', 3);
            Survey.bcNeg('diaph', 3);
            Survey.bcNeg('withd', 3);
            Survey.bcNeg('sperm', 3);
            Survey.bcNeg('sponge', 3);
            Survey.bcNeg('fam', 3);
            break;
          // "I had another problem using it correctly
          case 17:
            break;
          // "I got pregnant
          case 18:
            Survey.bcNeg('mcondom', 3);
            break;
          // "High blood pressure
          case 19:
            Survey.bcNeg('ocp', 999);
            Survey.bcNeg('ortho_evra', 999);
            Survey.bcNeg('nuvaring', 999);
            break;
          // "Blood clot in vein or lungs
          case 20:
            Survey.bcNeg('ocp', 999);
            Survey.bcNeg('ortho_evra', 999);
            Survey.bcNeg('nuvaring', 999);
            break;
          // "Stroke or heart attack
          case 21:
            Survey.bcNeg('ocp', 999);
            Survey.bcNeg('depo', 999);
            Survey.bcNeg('ortho_evra', 999);
            Survey.bcNeg('nuvaring', 999);
            break;
          // "Another health problem
          case 22:
            break;
          // "I didn't like the prolonged breathing
          case 23:
            break;
          // "I didn't like the heavy bleeding
          case 24:
            break;
          // "I didn't like the irregular bleeding
          case 25:
            break;
          // "I didn't like the absence of bleeding
          case 26:
            break;
          // "I didn't like something else about my periods
          case 27:
            break;
          // "My partner didn't like it
          case 28:
            Survey.bcNeg('mcondom', 2);
            break;
      }
    };

    q19aiscore.diaph = function(prob) {
      switch (prob)
      {
          // Breast Tenderness
          case 1:
            break;
          // Cramping or pain
          case 2:
            break;
          // Hair Loss
          case 3:
            break;
          // Depression or mood swings
          case 4:
            break;
          // Nausea or vomiting
          case 5:
            break;
          // Weight gain
          case 6:
            break;
          // Migraines or very bad headaches
          case 7:
            break;
          // Discharge
          case 8:
            break;
          // Other changes to my body
          case 9:
            break;
          // "I couldn't get to the clinic
          case 10:
            break;
          // "I couldn't get to the pharmacy
          case 11:
            break;
          // "It was too expensive
          case 12:
            break;
          // "I had another problem getting the birth control
          case 13:
            break;
          // "I forgot to take it or missed too many doses
          case 14:
            break;
          // "I failed to restart after break for period
          case 15:
            break;
          // "I didn't use it every time I had sex
          case 16:
            Survey.bcNeg('mcondom', 1);
            Survey.bcNeg('fcondom', 3);
            Survey.bcNeg('ccap', 3);
            Survey.bcNeg('diaph', 3);
            Survey.bcNeg('withd', 2);
            Survey.bcNeg('sperm', 2);
            Survey.bcNeg('sponge', 3);
            //Survey.bcNeg('fam', 3);
            break;
          // "I had another problem using it correctly
          case 17:
            break;
          // "I got pregnant
          case 18:
            Survey.bcNeg('diaph', 3);
            break;
          // "High blood pressure
          case 19:
            Survey.bcNeg('ocp', 999);
            Survey.bcNeg('ortho_evra', 999);
            Survey.bcNeg('nuvaring', 999);
            break;
          // "Blood clot in vein or lungs
          case 20:
            Survey.bcNeg('ocp', 999);
            Survey.bcNeg('ortho_evra', 999);
            Survey.bcNeg('nuvaring', 999);
            break;
          // "Stroke or heart attack
          case 21:
            Survey.bcNeg('ocp', 999);
            Survey.bcNeg('depo', 999);
            Survey.bcNeg('ortho_evra', 999);
            Survey.bcNeg('nuvaring', 999);
            break;
          // "Another health problem
          case 22:
            break;
          // "I didn't like the prolonged breathing
          case 23:
            break;
          // "I didn't like the heavy bleeding
          case 24:
            Survey.bcNeg('ortho_evra', 1);
            break;
          // "I didn't like the irregular bleeding
          case 25:
            break;
          // "I didn't like the absence of bleeding
          case 26:
            break;
          // "I didn't like something else about my periods
          case 27:
            break;
          // "My partner didn't like it
          case 28:
            Survey.bcNeg('diaph', 1);
            break;
      }
    };

    q19aiscore.fcondom = function(prob) {
      switch (prob)
      {
          // Breast Tenderness
          case 1:
            break;
          // Cramping or pain
          case 2:
            break;
          // Hair Loss
          case 3:
            break;
          // Depression or mood swings
          case 4:
            break;
          // Nausea or vomiting
          case 5:
            break;
          // Weight gain
          case 6:
            break;
          // Migraines or very bad headaches
          case 7:
            break;
          // Discharge
          case 8:
            break;
          // Other changes to my body
          case 9:
            break;
          // "I couldn't get to the clinic
          case 10:
            break;
          // "I couldn't get to the pharmacy
          case 11:
            break;
          // "It was too expensive
          case 12:
            break;
          // "I had another problem getting the birth control
          case 13:
            break;
          // "I forgot to take it or missed too many doses
          case 14:
            break;
          // "I failed to restart after break for period
          case 15:
            break;
          // "I didn't use it every time I had sex
          case 16:
            Survey.bcNeg('mcondom', 1);
            Survey.bcNeg('fcondom', 2);
            Survey.bcNeg('ccap', 2);
            Survey.bcNeg('diaph', 2);
            Survey.bcNeg('withd', 2);
            Survey.bcNeg('sperm', 2);
            Survey.bcNeg('sponge', 2);
            break;
          // "I had another problem using it correctly
          case 17:
            break;
          // "I got pregnant
          case 18:
            Survey.bcNeg('fcondom', 3);
            break;
          // "High blood pressure
          case 19:
            Survey.bcNeg('ocp', 999);
            Survey.bcNeg('ortho_evra', 999);
            Survey.bcNeg('nuvaring', 999);
            break;
          // "Blood clot in vein or lungs
          case 20:
            Survey.bcNeg('ocp', 999);
            Survey.bcNeg('ortho_evra', 999);
            Survey.bcNeg('nuvaring', 999);
            break;
          // "Stroke or heart attack
          case 21:
            Survey.bcNeg('ocp', 999);
            Survey.bcNeg('depo', 999);
            Survey.bcNeg('ortho_evra', 999);
            Survey.bcNeg('nuvaring', 999);
            break;
          // "Another health problem
          case 22:
            break;
          // "I didn't like the prolonged breathing
          case 23:
            break;
          // "I didn't like the heavy bleeding
          case 24:
            Survey.bcNeg('ortho_evra', 1);
            break;
          // "I didn't like the irregular bleeding
          case 25:
            break;
          // "I didn't like the absence of bleeding
          case 26:
            break;
          // "I didn't like something else about my periods
          case 27:
            break;
          // "My partner didn't like it
          case 28:
            Survey.bcNeg('fcondom', 1);
            break;
      }
    };

    q19aiscore.sponge = function(prob) {
      switch (prob)
      {
          // Breast Tenderness
          case 1:
            break;
          // Cramping or pain
          case 2:
            break;
          // Hair Loss
          case 3:
            break;
          // Depression or mood swings
          case 4:
            break;
          // Nausea or vomiting
          case 5:
            break;
          // Weight gain
          case 6:
            break;
          // Migraines or very bad headaches
          case 7:
            break;
          // Discharge
          case 8:
            break;
          // Other changes to my body
          case 9:
            break;
          // "I couldn't get to the clinic
          case 10:
            break;
          // "I couldn't get to the pharmacy
          case 11:
            break;
          // "It was too expensive
          case 12:
            break;
          // "I had another problem getting the birth control
          case 13:
            break;
          // "I forgot to take it or missed too many doses
          case 14:
            break;
          // "I failed to restart after break for period
          case 15:
            break;
          // "I didn't use it every time I had sex
          case 16:
            Survey.bcNeg('mcondom', 1);
            Survey.bcNeg('fcondom', 3);
            Survey.bcNeg('ccap', 3);
            Survey.bcNeg('diaph', 3);
            Survey.bcNeg('withd', 2);
            Survey.bcNeg('sperm', 2);
            Survey.bcNeg('sponge', 3);
            break;
          // "I had another problem using it correctly
          case 17:
            break;
          // "I got pregnant
          case 18:
            Survey.bcNeg('sponge', 3);
            break;
          // "High blood pressure
          case 19:
            Survey.bcNeg('ocp', 999);
            Survey.bcNeg('ortho_evra', 999);
            Survey.bcNeg('nuvaring', 999);
            break;
          // "Blood clot in vein or lungs
          case 20:
            Survey.bcNeg('ocp', 999);
            Survey.bcNeg('ortho_evra', 999);
            Survey.bcNeg('nuvaring', 999);
            break;
          // "Stroke or heart attack
          case 21:
            Survey.bcNeg('ocp', 999);
            Survey.bcNeg('depo', 999);
            Survey.bcNeg('ortho_evra', 999);
            Survey.bcNeg('nuvaring', 999);
            break;
          // "Another health problem
          case 22:
            break;
          // "I didn't like the prolonged breathing
          case 23:
            break;
          // "I didn't like the heavy bleeding
          case 24:
            Survey.bcNeg('ortho_evra', 1);
            break;
          // "I didn't like the irregular bleeding
          case 25:
            break;
          // "I didn't like the absence of bleeding
          case 26:
            break;
          // "I didn't like something else about my periods
          case 27:
            break;
          // "My partner didn't like it
          case 28:
            Survey.bcNeg('sponge', 1);
            break;
      }
    };

    q19aiscore.fam = function(prob) {
      switch (prob)
      {
          // Breast Tenderness
          case 1:
            break;
          // Cramping or pain
          case 2:
            break;
          // Hair Loss
          case 3:
            break;
          // Depression or mood swings
          case 4:
            break;
          // Nausea or vomiting
          case 5:
            break;
          // Weight gain
          case 6:
            break;
          // Migraines or very bad headaches
          case 7:
            break;
          // Discharge
          case 8:
            break;
          // Other changes to my body
          case 9:
            break;
          // "I couldn't get to the clinic
          case 10:
            break;
          // "I couldn't get to the pharmacy
          case 11:
            break;
          // "It was too expensive
          case 12:
            break;
          // "I had another problem getting the birth control
          case 13:
            break;
          // "I forgot to take it or missed too many doses
          case 14:
            break;
          // "I failed to restart after break for period
          case 15:
            break;
          // "I didn't use it every time I had sex
          case 16:
            Survey.bcNeg('mcondom', 3);
            Survey.bcNeg('fcondom', 3);
            Survey.bcNeg('ccap', 3);
            Survey.bcNeg('diaph', 3);
            Survey.bcNeg('withd', 3);
            Survey.bcNeg('sperm', 3);
            Survey.bcNeg('sponge', 3);
            Survey.bcNeg('fam', 3);
            break;
          // "I had another problem using it correctly
          case 17:
            break;
          // "I got pregnant
          case 18:
            Survey.bcNeg('fam', 3);
            break;
          // "High blood pressure
          case 19:
            Survey.bcNeg('ocp', 999);
            Survey.bcNeg('ortho_evra', 999);
            Survey.bcNeg('nuvaring', 999);
            break;
          // "Blood clot in vein or lungs
          case 20:
            Survey.bcNeg('ocp', 999);
            Survey.bcNeg('ortho_evra', 999);
            Survey.bcNeg('nuvaring', 999);
            break;
          // "Stroke or heart attack
          case 21:
            Survey.bcNeg('ocp', 999);
            Survey.bcNeg('depo', 999);
            Survey.bcNeg('ortho_evra', 999);
            Survey.bcNeg('nuvaring', 999);
            break;
          // "Another health problem
          case 22:
            break;
          // "I didn't like the prolonged breathing
          case 23:
            break;
          // "I didn't like the heavy bleeding
          case 24:
            break;
          // "I didn't like the irregular bleeding
          case 25:
            break;
          // "I didn't like the absence of bleeding
          case 26:
            break;
          // "I didn't like something else about my periods
          case 27:
            break;
          // "My partner didn't like it
          case 28:
            Survey.bcNeg('paragard', 1);
            Survey.bcNeg('mirena', 1);
            break;
      }
    };

    q19aiscore.ec = function(prob) {
      switch (prob)
      {
          // Breast Tenderness
          case 1:
            break;
          // Cramping or pain
          case 2:
            break;
          // Hair Loss
          case 3:
            break;
          // Depression or mood swings
          case 4:
            break;
          // Nausea or vomiting
          case 5:
            break;
          // Weight gain
          case 6:
            break;
          // Migraines or very bad headaches
          case 7:
            break;
          // Discharge
          case 8:
            break;
          // Other changes to my body
          case 9:
            break;
          // "I couldn't get to the clinic
          case 10:
            break;
          // "I couldn't get to the pharmacy
          case 11:
            break;
          // "It was too expensive
          case 12:
            break;
          // "I had another problem getting the birth control
          case 13:
            break;
          // "I forgot to take it or missed too many doses
          case 14:
            break;
          // "I failed to restart after break for period
          case 15:
            break;
          // "I didn't use it every time I had sex
          case 16:
            break;
          // "I had another problem using it correctly
          case 17:
            break;
          // "I got pregnant
          case 18:
            break;
          // "High blood pressure
          case 19:
            break;
          // "Blood clot in vein or lungs
          case 20:
            break;
          // "Stroke or heart attack
          case 21:
            break;
          // "Another health problem
          case 22:
            break;
          // "I didn't like the prolonged breathing
          case 23:
            break;
          // "I didn't like the heavy bleeding
          case 24:
            break;
          // "I didn't like the irregular bleeding
          case 25:
            break;
          // "I didn't like the absence of bleeding
          case 26:
            break;
          // "I didn't like something else about my periods
          case 27:
            break;
          // "My partner didn't like it
          case 28:
            break;
      }
    };

    q19aiscore.paragard = function(prob) {
      switch (prob)
      {
          // Breast Tenderness
          case 1:
            break;
          // Cramping or pain
          case 2:
            Survey.bcNeg('paragard', 2);
            Survey.bcNeg('mirena', 1);
            break;
          // Hair Loss
          case 3:
            break;
          // Depression or mood swings
          case 4:
            break;
          // Nausea or vomiting
          case 5:
            break;
          // Weight gain
          case 6:
            break;
          // Migraines or very bad headaches
          case 7:
            break;
          // Discharge
          case 8:
            Survey.bcNeg('paragard', 1);
            Survey.bcNeg('mirena', 1);
            break;
          // Other changes to my body
          case 9:
            break;
          // "I couldn't get to the clinic
          case 10:
            break;
          // "I couldn't get to the pharmacy
          case 11:
            break;
          // "It was too expensive
          case 12:
            Survey.bcNeg('paragard', 1);
            break;
          // "I had another problem getting the birth control
          case 13:
            break;
          // "I forgot to take it or missed too many doses
          case 14:
            break;
          // "I failed to restart after break for period
          case 15:
            break;
          // "I didn't use it every time I had sex
          case 16:
            break;
          // "I had another problem using it correctly
          case 17:
            break;
          // "I got pregnant
          case 18:
            Survey.bcNeg('paragard', 3);
            break;
          // "High blood pressure
          case 19:
              Survey.bcNeg('ocp', 999);
              Survey.bcNeg('ortho_evra', 999);
              Survey.bcNeg('nuvaring', 999);
            break;
          // "Blood clot in vein or lungs
          case 20:
            Survey.bcNeg('ocp', 999);
            Survey.bcNeg('ortho_evra', 999);
            Survey.bcNeg('nuvaring', 999);
            break;
          // "Stroke or heart attack
          case 21:
            Survey.bcNeg('ocp', 999);
            Survey.bcNeg('depo', 999);
            Survey.bcNeg('ortho_evra', 999);
            Survey.bcNeg('nuvaring', 999);
            break;
          // "Another health problem
          case 22:
            break;
          // "I didn't like the prolonged breathing
          case 23:
            Survey.bcPos('ocp', 1);
            Survey.bcPos('ortho_evra', 1);
            Survey.bcPos('nuvaring', 1);
            Survey.bcNeg('paragard', 2);
            break;
          // "I didn't like the heavy bleeding
          case 24:
            Survey.bcPos('ocp', 1);
            Survey.bcPos('ortho_evra', 1);
            Survey.bcPos('nuvaring', 1);
            Survey.bcNeg('paragard', 2);
            Survey.bcPos('mirena', 1);
            Survey.bcPos('implanon', 1);
            break;
          // "I didn't like the irregular bleeding
          case 25:
            Survey.bcPos('ocp', 1);
            Survey.bcPos('ortho_evra', 1);
            Survey.bcPos('nuvaring', 1);
            Survey.bcNeg('paragard', 2);
            break;
          // "I didn't like the absence of bleeding
          case 26:
            break;
          // "I didn't like something else about my periods
          case 27:
            break;
          // "My partner didn't like it
          case 28:
            Survey.bcNeg('paragard', 1);
            Survey.bcNeg('mirena', 1);
            break;
      }
    };

    q19aiscore.mirena = function(prob) {
      switch (prob)
      {
          // Breast Tenderness
          case 1:
            break;
          // Cramping or pain
          case 2:
            Survey.bcNeg('paragard', 2);
            Survey.bcNeg('mirena', 1);
            break;
          // Hair Loss
          case 3:
            Survey.bcNeg('mirena', 2);
            break;
          // Depression or mood swings
          case 4:
            break;
          // Nausea or vomiting
          case 5:
            break;
          // Weight gain
          case 6:
            Survey.bcNeg('depo', 3);
            Survey.bcNeg('mirena', 1);
            break;
          // Migraines or very bad headaches
          case 7:
            Survey.bcNeg('mirena', 1);
            break;
          // Discharge
          case 8:
            Survey.bcNeg('paragard', 1);
            Survey.bcNeg('mirena', 1);
            break;
          // Other changes to my body
          case 9:
            break;
          // "I couldn't get to the clinic
          case 10:
            break;
          // "I couldn't get to the pharmacy
          case 11:
            break;
          // "It was too expensive
          case 12:
            Survey.bcNeg('mirena', 1);
            break;
          // "I had another problem getting the birth control
          case 13:
            break;
          // "I forgot to take it or missed too many doses
          case 14:
            break;
          // "I failed to restart after break for period
          case 15:
            break;
          // "I didn't use it every time I had sex
          case 16:
            break;
          // "I had another problem using it correctly
          case 17:
            break;
          // "I got pregnant
          case 18:
            Survey.bcNeg('mirena', 3);
            break;
          // "High blood pressure
          case 19:
            Survey.bcNeg('ocp', 999);
            Survey.bcNeg('ortho_evra', 999);
            Survey.bcNeg('nuvaring', 999);
            break;
          // "Blood clot in vein or lungs
          case 20:
            Survey.bcNeg('ocp', 999);
            Survey.bcNeg('ortho_evra', 999);
            Survey.bcNeg('nuvaring', 999);
            break;
          // "Stroke or heart attack
          case 21:
            Survey.bcNeg('ocp', 999);
            Survey.bcNeg('depo', 999);
            Survey.bcNeg('ortho_evra', 999);
            Survey.bcNeg('nuvaring', 999);
            Survey.bcNeg('mirena', 999);
            break;
          // "Another health problem
          case 22:
            break;
          // "I didn't like the prolonged breathing
          case 23:
            Survey.bcPos('ocp', 1);
            Survey.bcPos('ortho_evra', 1);
            Survey.bcPos('nuvaring', 1);
            Survey.bcPos('paragard', 1);
            Survey.bcNeg('mirena', 1);
            break;
          // "I didn't like the heavy bleeding
          case 24:
            Survey.bcPos('ocp', 1);
            Survey.bcPos('ortho_evra', 1);
            Survey.bcPos('nuvaring', 1);
            Survey.bcNeg('mirena', 1);
            break;
          // "I didn't like the irregular bleeding
          case 25:
            Survey.bcPos('ocp', 1);
            Survey.bcPos('ortho_evra', 1);
            Survey.bcPos('nuvaring', 1);
            Survey.bcPos('paragard', 1);
            Survey.bcNeg('mirena', 1);
            break;
          // "I didn't like the absence of bleeding
          case 26:
            break;
          // "I didn't like something else about my periods
          case 27:
            break;
          // "My partner didn't like it
          case 28:
            Survey.bcNeg('paragard', 1);
            Survey.bcNeg('mirena', 1);
            break;
      }
    };

    q19aiscore.withd = function(prob) {
      switch (prob)
      {
          // Breast Tenderness
          case 1:
            break;
          // Cramping or pain
          case 2:
            break;
          // Hair Loss
          case 3:
            break;
          // Depression or mood swings
          case 4:
            break;
          // Nausea or vomiting
          case 5:
            break;
          // Weight gain
          case 6:
            break;
          // Migraines or very bad headaches
          case 7:
            break;
          // Discharge
          case 8:
            break;
          // Other changes to my body
          case 9:
            break;
          // "I couldn't get to the clinic
          case 10:
            break;
          // "I couldn't get to the pharmacy
          case 11:
            break;
          // "It was too expensive
          case 12:
            break;
          // "I had another problem getting the birth control
          case 13:
            break;
          // "I forgot to take it or missed too many doses
          case 14:
            break;
          // "I failed to restart after break for period
          case 15:
            break;
          // "I didn't use it every time I had sex
          case 16:
            break;
          // "I had another problem using it correctly
          case 17:
            break;
          // "I got pregnant
          case 18:
            break;
          // "High blood pressure
          case 19:
              //Survey.bcNeg('ocp', 999);
              //Survey.bcNeg('ortho_evra', 999);
              //Survey.bcNeg('nuvaring', 999);
            break;
          // "Blood clot in vein or lungs
          case 20:
            break;
          // "Stroke or heart attack
          case 21:
            break;
          // "Another health problem
          case 22:
            break;
          // "I didn't like the prolonged breathing
          case 23:
            break;
          // "I didn't like the heavy bleeding
          case 24:
            break;
          // "I didn't like the irregular bleeding
          case 25:
            break;
          // "I didn't like the absence of bleeding
          case 26:
            break;
          // "I didn't like something else about my periods
          case 27:
            break;
          // "My partner didn't like it
          case 28:
            break;
      }
    };

    q19aiscore.sperm = function(prob) {
      switch (prob)
      {
          // Breast Tenderness
          case 1:
            break;
          // Cramping or pain
          case 2:
            break;
          // Hair Loss
          case 3:
            break;
          // Depression or mood swings
          case 4:
            break;
          // Nausea or vomiting
          case 5:
            break;
          // Weight gain
          case 6:
            break;
          // Migraines or very bad headaches
          case 7:
            break;
          // Discharge
          case 8:
            break;
          // Other changes to my body
          case 9:
            break;
          // "I couldn't get to the clinic
          case 10:
            break;
          // "I couldn't get to the pharmacy
          case 11:
            break;
          // "It was too expensive
          case 12:
            break;
          // "I had another problem getting the birth control
          case 13:
            break;
          // "I forgot to take it or missed too many doses
          case 14:
            break;
          // "I failed to restart after break for period
          case 15:
            break;
          // "I didn't use it every time I had sex
          case 16:
            Survey.bcNeg('mcondom', 2);
            Survey.bcNeg('fcondom', 2);
            Survey.bcNeg('ccap', 2);
            Survey.bcNeg('diaph', 2);
            Survey.bcNeg('withd', 2);
            Survey.bcNeg('sperm', 3);
            Survey.bcNeg('sponge', 2);
            break;
          // "I had another problem using it correctly
          case 17:
            break;
          // "I got pregnant
          case 18:
            Survey.bcNeg('sperm', 3);
            break;
          // "High blood pressure
          case 19:
            Survey.bcNeg('ocp', 999);
            Survey.bcNeg('ortho_evra', 999);
            Survey.bcNeg('nuvaring', 999);
            break;
          // "Blood clot in vein or lungs
          case 20:
            Survey.bcNeg('ocp', 999);
            Survey.bcNeg('ortho_evra', 999);
            Survey.bcNeg('nuvaring', 999);
            break;
          // "Stroke or heart attack
          case 21:
            Survey.bcNeg('ocp', 999);
            Survey.bcNeg('depo', 999);
            Survey.bcNeg('ortho_evra', 999);
            Survey.bcNeg('nuvaring', 999);
            break;
          // "Another health problem
          case 22:
            break;
          // "I didn't like the prolonged breathing
          case 23:
            break;
          // "I didn't like the heavy bleeding
          case 24:
            break;
          // "I didn't like the irregular bleeding
          case 25:
            break;
          // "I didn't like the absence of bleeding
          case 26:
            break;
          // "I didn't like something else about my periods
          case 27:
            break;
          // "My partner didn't like it
          case 28:
            Survey.bcNeg('sperm', 1);
            break;
      }
    };

    q19aiscore.btl = function(prob) {
      switch (prob)
      {
          // Breast Tenderness
          case 1:
            break;
          // Cramping or pain
          case 2:
            break;
          // Hair Loss
          case 3:
            break;
          // Depression or mood swings
          case 4:
            break;
          // Nausea or vomiting
          case 5:
            break;
          // Weight gain
          case 6:
            break;
          // Migraines or very bad headaches
          case 7:
            break;
          // Discharge
          case 8:
            break;
          // Other changes to my body
          case 9:
            break;
          // "I couldn't get to the clinic
          case 10:
            break;
          // "I couldn't get to the pharmacy
          case 11:
            break;
          // "It was too expensive
          case 12:
            Survey.bcNeg('btl', 1);
            break;
          // "I had another problem getting the birth control
          case 13:
            break;
          // "I forgot to take it or missed too many doses
          case 14:
            break;
          // "I failed to restart after break for period
          case 15:
            break;
          // "I didn't use it every time I had sex
          case 16:
            break;
          // "I had another problem using it correctly
          case 17:
            break;
          // "I got pregnant
          case 18:
            Survey.bcNeg('btl', 3);
            break;
          // "High blood pressure
          case 19:
            Survey.bcNeg('ocp', 999);
            Survey.bcNeg('ortho_evra', 999);
            Survey.bcNeg('nuvaring', 999);
            break;
          // "Blood clot in vein or lungs
          case 20:
            Survey.bcNeg('ocp', 999);
            Survey.bcNeg('ortho_evra', 999);
            Survey.bcNeg('nuvaring', 999);
            break;
          // "Stroke or heart attack
          case 21:
            Survey.bcNeg('ocp', 999);
            Survey.bcNeg('depo', 999);
            Survey.bcNeg('ortho_evra', 999);
            Survey.bcNeg('nuvaring', 999);
            break;
          // "Another health problem
          case 22:
            break;
          // "I didn't like the prolonged breathing
          case 23:
            break;
          // "I didn't like the heavy bleeding
          case 24:
            break;
          // "I didn't like the irregular bleeding
          case 25:
            break;
          // "I didn't like the absence of bleeding
          case 26:
            break;
          // "I didn't like something else about my periods
          case 27:
            break;
          // "My partner didn't like it
          case 28:
            Survey.bcNeg('btl', 1);
            break;
      }
    };

    q19aiscore.vas = function(prob) {
      switch (prob)
      {
          // Breast Tenderness
          case 1:
            break;
          // Cramping or pain
          case 2:
            break;
          // Hair Loss
          case 3:
            break;
          // Depression or mood swings
          case 4:
            break;
          // Nausea or vomiting
          case 5:
            break;
          // Weight gain
          case 6:
            break;
          // Migraines or very bad headaches
          case 7:
            break;
          // Discharge
          case 8:
            break;
          // Other changes to my body
          case 9:
            break;
          // "I couldn't get to the clinic
          case 10:
            break;
          // "I couldn't get to the pharmacy
          case 11:
            break;
          // "It was too expensive
          case 12:
            break;
          // "I had another problem getting the birth control
          case 13:
            break;
          // "I forgot to take it or missed too many doses
          case 14:
            break;
          // "I failed to restart after break for period
          case 15:
            break;
          // "I didn't use it every time I had sex
          case 16:
            break;
          // "I had another problem using it correctly
          case 17:
            break;
          // "I got pregnant
          case 18:
            Survey.bcNeg('vas', 3);
            break;
          // "High blood pressure
          case 19:
            Survey.bcNeg('ocp', 999);
            Survey.bcNeg('ortho_evra', 999);
            Survey.bcNeg('nuvaring', 999);
            break;
          // "Blood clot in vein or lungs
          case 20:
            Survey.bcNeg('ocp', 999);
            Survey.bcNeg('ortho_evra', 999);
            Survey.bcNeg('nuvaring', 999);
            break;
          // "Stroke or heart attack
          case 21:
            Survey.bcNeg('ocp', 999);
            Survey.bcNeg('depo', 999);
            Survey.bcNeg('ortho_evra', 999);
            Survey.bcNeg('nuvaring', 999);
            break;
          // "Another health problem
          case 22:
            break;
          // "I didn't like the prolonged breathing
          case 23:
            break;
          // "I didn't like the heavy bleeding
          case 24:
            break;
          // "I didn't like the irregular bleeding
          case 25:
            break;
          // "I didn't like the absence of bleeding
          case 26:
            break;
          // "I didn't like something else about my periods
          case 27:
            break;
          // "My partner didn't like it
          case 28:
            Survey.bcNeg('vas', 1);
            break;
      }
    };

    q19aiscore.implanon = function(prob) {
      switch (prob)
      {
          // Breast Tenderness
          case 1:
            break;
          // Cramping or pain
          case 2:
            break;
          // Hair Loss
          case 3:
            Survey.bcNeg('implanon', 2);
            break;
          // Depression or mood swings
          case 4:
            break;
          // Nausea or vomiting
          case 5:
            break;
          // Weight gain
          case 6:
            Survey.bcNeg('depo', 3);
            Survey.bcNeg('implanon', 1);
            break;
          // Migraines or very bad headaches
          case 7:
            Survey.bcNeg('implanon', 1);
            break;
          // Discharge
          case 8:
            break;
          // Other changes to my body
          case 9:
            break;
          // "I couldn't get to the clinic
          case 10:
            break;
          // "I couldn't get to the pharmacy
          case 11:
            break;
          // "It was too expensive
          case 12:
            Survey.bcNeg('implanon', 1);
            break;
          // "I had another problem getting the birth control
          case 13:
            break;
          // "I forgot to take it or missed too many doses
          case 14:
            break;
          // "I failed to restart after break for period
          case 15:
            break;
          // "I didn't use it every time I had sex
          case 16:
            break;
          // "I had another problem using it correctly
          case 17:
            break;
          // "I got pregnant
          case 18:
            Survey.bcNeg('implanon', 3);
            break;
          // "High blood pressure
          case 19:
            Survey.bcNeg('ocp', 999);
            Survey.bcNeg('ortho_evra', 999);
            Survey.bcNeg('nuvaring', 999);
            break;
          // "Blood clot in vein or lungs
          case 20:
            Survey.bcNeg('ocp', 999);
            Survey.bcNeg('ortho_evra', 999);
            Survey.bcNeg('nuvaring', 999);
            break;
          // "Stroke or heart attack
          case 21:
            Survey.bcNeg('ocp', 999);
            Survey.bcNeg('depo', 999);
            Survey.bcNeg('ortho_evra', 999);
            Survey.bcNeg('nuvaring', 999);
            Survey.bcNeg('implanon', 999);
            break;
          // "Another health problem
          case 22:
            break;
          // "I didn't like the prolonged breathing
          case 23:
            Survey.bcPos('ocp', 1);
            Survey.bcPos('ortho_evra', 1);
            Survey.bcPos('nuvaring', 1);
            Survey.bcNeg('implanon', 1);
            break;
          // "I didn't like the heavy bleeding
          case 24:
            Survey.bcNeg('implanon', 1);
            break;
          // "I didn't like the irregular bleeding
          case 25:
            Survey.bcPos('ocp', 1);
            Survey.bcPos('ortho_evra', 1);
            Survey.bcPos('nuvaring', 1);
            Survey.bcNeg('implanon', 1);
            break;
          // "I didn't like the absence of bleeding
          case 26:
            Survey.bcPos('ocp', 1);
            Survey.bcPos('ortho_evra', 1);
            Survey.bcPos('nuvaring', 1);
            Survey.bcNeg('depo', 1);
            Survey.bcNeg('implanon', 1);
            break;
          // "I didn't like something else about my periods
          case 27:
            break;
          // "My partner didn't like it
          case 28:
            Survey.bcNeg('implanon', 1);
            break;
      }
    };

    q19aiscore.bf = function(prob) {
      switch (prob)
      {
          // Breast Tenderness
          case 1:
              Survey.bcNeg('bf', 2);
            break;
          // Cramping or pain
          case 2:
            break;
          // Hair Loss
          case 3:
            break;
          // Depression or mood swings
          case 4:
            break;
          // Nausea or vomiting
          case 5:
            break;
          // Weight gain
          case 6:
            break;
          // Migraines or very bad headaches
          case 7:
            break;
          // Discharge
          case 8:
            break;
          // Other changes to my body
          case 9:
            break;
          // "I couldn't get to the clinic
          case 10:
            break;
          // "I couldn't get to the pharmacy
          case 11:
            break;
          // "It was too expensive
          case 12:
            break;
          // "I had another problem getting the birth control
          case 13:
            break;
          // "I forgot to take it or missed too many doses
          case 14:
            break;
          // "I failed to restart after break for period
          case 15:
            break;
          // "I didn't use it every time I had sex
          case 16:
            break;
          // "I had another problem using it correctly
          case 17:
            break;
          // "I got pregnant
          case 18:
            Survey.bcNeg('bf', 3);
            break;
          // "High blood pressure
          case 19:
            Survey.bcNeg('ocp', 999);
            Survey.bcNeg('ortho_evra', 999);
            Survey.bcNeg('nuvaring', 999);
            break;
          // "Blood clot in vein or lungs
          case 20:
            Survey.bcNeg('ocp', 999);
            Survey.bcNeg('ortho_evra', 999);
            Survey.bcNeg('nuvaring', 999);
            break;
          // "Stroke or heart attack
          case 21:
            Survey.bcNeg('ocp', 999);
            Survey.bcNeg('depo', 999);
            Survey.bcNeg('ortho_evra', 999);
            Survey.bcNeg('nuvaring', 999);
            break;
          // "Another health problem
          case 22:
            break;
          // "I didn't like the prolonged breathing
          case 23:
            break;
          // "I didn't like the heavy bleeding
          case 24:
            break;
          // "I didn't like the irregular bleeding
          case 25:
            break;
          // "I didn't like the absence of bleeding
          case 26:
            break;
          // "I didn't like something else about my periods
          case 27:
            break;
          // "My partner didn't like it
          case 28:
            break;
      }
    };

    // score.abstinence
    // this is new as of 04/15/15
    q19aiscore.abstinence = function(prob) {
      switch (prob)
      {
          // Breast Tenderness
          case 1:
            break;
          // Cramping or pain
          case 2:
            break;
          // Hair Loss
          case 3:
            break;
          // Depression or mood swings
          case 4:
            break;
          // Nausea or vomiting
          case 5:
            break;
          // Weight gain
          case 6:
            break;
          // Migraines or very bad headaches
          case 7:
            break;
          // Discharge
          case 8:
            break;
          // Other changes to my body
          case 9:
            break;
          // "I couldn't get to the clinic
          case 10:
            break;
          // "I couldn't get to the pharmacy
          case 11:
            break;
          // "It was too expensive
          case 12:
            break;
          // "I had another problem getting the birth control
          case 13:
            break;
          // "I forgot to take it or missed too many doses
          case 14:
            break;
          // "I failed to restart after break for period
          case 15:
            break;
          // "I didn't use it every time I had sex
          case 16:
            break;
          // "I had another problem using it correctly
          case 17:
            break;
          // "I got pregnant
          case 18:
            break;
          // "High blood pressure
          case 19:
            Survey.bcNeg('ocp', 999);
            Survey.bcNeg('ortho_evra', 999);
            Survey.bcNeg('nuvaring', 999);
            break;
          // "Blood clot in vein or lungs
          case 20:
            Survey.bcNeg('ocp', 999);
            Survey.bcNeg('ortho_evra', 999);
            Survey.bcNeg('nuvaring', 999);
            break;
          // "Stroke or heart attack
          case 21:
            Survey.bcNeg('ocp', 999);
            Survey.bcNeg('depo', 999);
            Survey.bcNeg('ortho_evra', 999);
            Survey.bcNeg('nuvaring', 999);
            break;
          // "Another health problem
          case 22:
            break;
          // "I didn't like the prolonged breathing
          case 23:
            break;
          // "I didn't like the heavy bleeding
          case 24:
            break;
          // "I didn't like the irregular bleeding
          case 25:
            break;
          // "I didn't like the absence of bleeding
          case 26:
            break;
          // "I didn't like something else about my periods
          case 27:
            break;
          // "My partner didn't like it
          case 28:
            break;
      }
    };

    q19aiscore.bcProblemScore = function(bc, prob)
    {
        console.log('q19ai bc:' + bc + 'prob:' + prob);
        switch (bc)
        {
            // Birth Control
            case 1:
              q19aiscore.ocp(prob);
              break;
            // Mini Pills
            case 2:
              q19aiscore.minipills(prob);
              break;
            // Ortho Evra
            case 3:
              q19aiscore.ortho_evra(prob);
              break;
            // Nuva Ring
            case 4:
              q19aiscore.nuvaring(prob);
              break;
            // Depo Provera
            case 5:
              q19aiscore.depo(prob);
              break;
            // Male Condom
            case 6:
              q19aiscore.mcondom(prob);
              break;
            // Diaphragm
            case 7:
              q19aiscore.diaph(prob);
              break;
            // Female Condom
            case 8:
              q19aiscore.fcondom(prob);
              break;
            // Sponge
            case 9:
              q19aiscore.sponge(prob);
              break;
            // Fam
            case 10:
              q19aiscore.fam(prob);
              break;
            // EC
            case 11:
              q19aiscore.ec(prob);
              break;
            // Paragard
            case 12:
              q19aiscore.paragard(prob);
              break;
            // Mirena
            case 13:
              q19aiscore.mirena(prob);
              break;
            // Withdrawal
            case 14:
              q19aiscore.withd(prob);
              break;
            // Spermicide
            case 15:
              q19aiscore.sperm(prob);
              break;
            // Tubes Tied
            case 16:
              q19aiscore.btl(prob);
              break;
            // Vasectomy
            case 17:
              q19aiscore.vas(prob);
              break;
            // Implant
            case 18:
              q19aiscore.implanon(prob);
              break;
            // Breast Feeding
            case 19:
              q19aiscore.bf(prob);
              break;
            case 20:
              q19aiscore.abstinence(prob);
              break;
        }
    };
    q19aiscore.score = function(argsArray) {
      console.log("q19ai.score");

      if(argsArray==undefined)
        return;
      for(var j=0; j<argsArray.length;j++){

        var args = argsArray[j]

        var argTypes = Question.prototype.scoreArgs.call(this, args);
        if (argTypes.hasValue && argTypes.hasOptions) {
          var bc = args.value;
          var probList = args.optionList;
          var len = probList.length;
          for (var i = probList.length - 1; i >= 0; i--) {
            var prob = probList[i].value
            q19aiscore.bcProblemScore(bc, prob);
          }
        }

      }
    };
    Survey.newQuestion(q19aiscore);

    // Scoring for 'q20'
    var q20score = new Question('q20');
    q20score.score = function(args) {
      console.log("q20.score");
      var argTypes = Question.prototype.scoreArgs.call(this, args);
      if (argTypes.hasValue) {
        var whenPregnant = args.value;
        switch (whenPregnant)
        {
            case 1:
              Survey.bcNeg('depo', 2);
              Survey.bcNeg('paragard', 3);
              Survey.bcNeg('mirena', 3);
              Survey.bcNeg('btl', 999);
              Survey.bcNeg('vas', 999);
              Survey.bcNeg('implanon', 3);
              break;
            case 2:
              Survey.bcNeg('btl', 999);
              Survey.bcNeg('vas', 999);
              break;
            case 3:
              Survey.bcPos('paragard', 1);
              Survey.bcPos('mirena', 1);
              Survey.bcNeg('btl', 999);
              Survey.bcNeg('vas', 999);
              Survey.bcPos('implanon', 1);
              break;
            case 4:
              Survey.bcPos('paragard', 1);
              Survey.bcPos('mirena', 1);
              Survey.bcNeg('btl', 999);
              Survey.bcNeg('vas', 999);
              Survey.bcPos('implanon', 1);
              break;
            case 5:
              Survey.bcPos('paragard', 1);
              Survey.bcPos('mirena', 1);
              Survey.bcPos('btl', 1);
              Survey.bcPos('vas', 1);
              Survey.bcPos('implanon', 1);
              break;
        }
      }
    };
    Survey.newQuestion(q20score);

    // Scoring for 'q21'
    var q21score = new Question('q21');
    q21score.score = function(args) {
      console.log("q21.score");
      var argTypes = Question.prototype.scoreArgs.call(this, args);
      if (argTypes.hasOptions) {
        var bcList = args.optionList;
        var len = bcList.length;
        for (var i = bcList.length - 1; i >= 0; i--) {
          var bc = bcList[i].value
          switch (bc)
          {
            // Easy to use
            case 1:
              Survey.bcNeg('abstinence', 3);
              Survey.bcPos('ocp', 1);
              Survey.bcPos('pop', 1);
              Survey.bcPos('ortho_evra', 1);
              Survey.bcPos('nuvaring', 1);
              Survey.bcPos('depo', 1);
              Survey.bcPos('mcondom', 1);
              Survey.bcNeg('ccap', 3);
              Survey.bcNeg('diaph', 3);
              Survey.bcPos('ec', 1);
              Survey.bcPos('paragard', 1);
              Survey.bcPos('mirena', 1);
              Survey.bcNeg('withd', 3);
              Survey.bcNeg('sperm', 1);
              Survey.bcNeg('sponge', 3);
              Survey.bcNeg('fam', 3);
              Survey.bcPos('btl', 1);
              Survey.bcPos('vas', 1);
              Survey.bcPos('implanon', 1);
              Survey.bcPos('bf', 1);
              break;
            // Safe with breast feeding
            case 2:
              Survey.bcPos('abstinence', 1);
              Survey.bcNeg('ocp', 2);
              Survey.bcPos('pop', 1);
              Survey.bcNeg('ortho_evra', 2);
              Survey.bcNeg('nuvaring', 2);
              Survey.bcPos('depo', 1);
              Survey.bcPos('mcondom', 1);
              Survey.bcPos('fcondom', 1);
              Survey.bcPos('ccap', 1);
              Survey.bcPos('diaph', 1);
              Survey.bcPos('ec', 1);
              Survey.bcPos('paragard', 1);
              Survey.bcPos('mirena', 1);
              Survey.bcPos('withd', 1);
              Survey.bcPos('sperm', 1);
              Survey.bcPos('sponge', 1);
              Survey.bcPos('fam', 1);
              Survey.bcPos('btl', 1);
              Survey.bcPos('vas', 1);
              Survey.bcPos('implanon', 1);
              Survey.bcPos('bf', 1);
              break;
            // Inexpensive
            case 3:
              Survey.bcPos('abstinence', 1);
              Survey.bcPos('ocp', 1);
              Survey.bcPos('pop', 1);
              Survey.bcPos('ortho_evra', 1);
              Survey.bcPos('nuvaring', 1);
              Survey.bcPos('depo', 1);
              Survey.bcPos('mcondom', 1);
              Survey.bcPos('fcondom', 1);
              Survey.bcPos('ccap', 1);
              Survey.bcPos('diaph', 1);
              //Survey.bcPos('ec', 1);
              Survey.bcPos('paragard', 1);
              Survey.bcPos('mirena', 1);
              Survey.bcPos('withd', 1);
              Survey.bcPos('sperm', 1);
              Survey.bcPos('sponge', 1);
              Survey.bcPos('fam', 1);
              Survey.bcPos('btl', 1);
              Survey.bcPos('vas', 1);
              Survey.bcPos('implanon', 1);
              Survey.bcPos('bf', 1);
              break;
            // Very effective
            case 4:
              Survey.bcPos('abstinence', 1);
              Survey.bcPos('ocp', 1);
              Survey.bcPos('pop', 1);
              Survey.bcPos('ortho_evra', 1);
              Survey.bcPos('nuvaring', 1);
              Survey.bcPos('depo', 1);
              Survey.bcNeg('mcondom', 2);
              Survey.bcNeg('fcondom', 3);
              Survey.bcNeg('ccap', 3);
              Survey.bcNeg('diaph', 2);
              //Survey.bcPos('ec', 1);
              Survey.bcPos('paragard', 1);
              Survey.bcPos('mirena', 1);
              Survey.bcNeg('withd', 3);
              Survey.bcNeg('sperm', 3);
              Survey.bcNeg('sponge', 3);
              Survey.bcNeg('fam', 3);
              Survey.bcPos('btl', 1);
              Survey.bcPos('vas', 1);
              Survey.bcPos('implanon', 1);
              Survey.bcPos('bf', 1);
              break;
            // Able to get pregnant quickly
            case 5:
              Survey.bcPos('abstinence', 1);
              Survey.bcPos('ocp', 1);
              Survey.bcPos('pop', 1);
              Survey.bcPos('ortho_evra', 1);
              Survey.bcPos('nuvaring', 1);
              Survey.bcNeg('depo', 3);
              Survey.bcPos('mcondom', 1);
              Survey.bcPos('fcondom', 1);
              Survey.bcPos('ccap', 1);
              Survey.bcPos('diaph', 1);
              Survey.bcPos('ec', 1);
              Survey.bcPos('paragard', 1);
              Survey.bcPos('mirena', 1);
              Survey.bcPos('withd', 1);
              Survey.bcPos('sperm', 1);
              Survey.bcPos('sponge', 1);
              Survey.bcPos('fam', 1);
              Survey.bcNeg('btl', 999);
              Survey.bcNeg('vas', 999);
              Survey.bcPos('implanon', 1);
              Survey.bcPos('bf', 1);
              break;
            // Not very many side-effects
            case 6:
              Survey.bcPos('abstinence', 1);
              Survey.bcPos('ocp', 1);
              Survey.bcPos('pop', 1);
              Survey.bcPos('ortho_evra', 1);
              Survey.bcPos('nuvaring', 1);
              Survey.bcNeg('depo', 1);
              Survey.bcPos('mcondom', 1);
              Survey.bcPos('fcondom', 1);
              Survey.bcPos('ccap', 1);
              Survey.bcPos('diaph', 1);
              Survey.bcPos('ec', 1);
              Survey.bcPos('paragard', 1);
              Survey.bcPos('mirena', 1);
              Survey.bcPos('withd', 1);
              Survey.bcPos('sperm', 1);
              Survey.bcPos('sponge', 1);
              Survey.bcPos('fam', 1);
              Survey.bcPos('btl', 1);
              Survey.bcPos('vas', 1);
              Survey.bcPos('implanon', 1);
              Survey.bcPos('bf', 1);
              break;
            // No hormones
            case 7:
              Survey.bcPos('abstinence', 1);
              Survey.bcNeg('ocp', 3);
              Survey.bcNeg('pop', 3);
              Survey.bcNeg('ortho_evra', 3);
              Survey.bcNeg('nuvaring', 3);
              Survey.bcNeg('depo', 3);
              Survey.bcPos('mcondom', 1);
              Survey.bcPos('fcondom', 1);
              Survey.bcPos('ccap', 1);
              Survey.bcPos('diaph', 1);
              Survey.bcNeg('ec', 3);
              Survey.bcPos('paragard', 1);
              Survey.bcNeg('mirena', 3);
              Survey.bcPos('withd', 1);
              Survey.bcPos('sperm', 1);
              Survey.bcPos('sponge', 1);
              Survey.bcPos('fam', 1);
              Survey.bcPos('btl', 1);
              Survey.bcPos('vas', 1);
              Survey.bcNeg('implanon', 3);
              Survey.bcPos('bf', 1);
              break;
            // Effective long term
            case 8:
              Survey.bcNeg('abstinence', 3);
              Survey.bcNeg('ocp', 3);
              Survey.bcNeg('pop', 3);
              Survey.bcNeg('ortho_evra', 3);
              Survey.bcNeg('nuvaring', 3);
              Survey.bcPos('depo', 1);
              Survey.bcNeg('mcondom', 3);
              Survey.bcNeg('fcondom', 3);
              Survey.bcNeg('ccap', 3);
              Survey.bcNeg('diaph', 3);
              Survey.bcNeg('ec', 3);
              Survey.bcPos('paragard', 1);
              Survey.bcPos('mirena', 1);
              Survey.bcNeg('withd', 3);
              Survey.bcNeg('sperm', 3);
              Survey.bcNeg('sponge', 3);
              Survey.bcNeg('fam', 3);
              Survey.bcPos('btl', 1);
              Survey.bcPos('vas', 1);
              Survey.bcPos('implanon', 1);
              //Survey.bcPos('bf', 1);
              break;
            // Do not need to interrupt
            case 9:
              Survey.bcNeg('abstinence', 3);
              Survey.bcPos('ocp', 1);
              Survey.bcPos('pop', 1);
              Survey.bcPos('ortho_evra', 1);
              Survey.bcPos('nuvaring', 1);
              Survey.bcPos('depo', 1);
              Survey.bcNeg('mcondom', 3);
              Survey.bcNeg('fcondom', 3);
              Survey.bcNeg('ccap', 3);
              Survey.bcNeg('diaph', 3);
              Survey.bcPos('ec', 1);
              Survey.bcPos('paragard', 1);
              Survey.bcPos('mirena', 1);
              Survey.bcNeg('withd', 3);
              Survey.bcNeg('sperm', 3);
              Survey.bcNeg('sponge', 3);
              Survey.bcNeg('fam', 3);
              Survey.bcPos('btl', 1);
              Survey.bcPos('vas', 1);
              Survey.bcPos('implanon', 1);
              Survey.bcPos('bf', 1);
              break;
            // Regular periods
            case 10:
              Survey.bcPos('abstinence', 1);
              Survey.bcPos('ocp', 1);
              Survey.bcNeg('pop', 1);
              Survey.bcPos('ortho_evra', 1);
              Survey.bcPos('nuvaring', 1);
              Survey.bcNeg('depo', 3);
              Survey.bcPos('mcondom', 1);
              Survey.bcPos('fcondom', 1);
              Survey.bcPos('ccap', 1);
              Survey.bcPos('diaph', 1);
              Survey.bcNeg('ec', 3);
              Survey.bcPos('paragard', 1);
              Survey.bcNeg('mirena', 3);
              Survey.bcPos('withd', 1);
              Survey.bcPos('sperm', 1);
              Survey.bcPos('sponge', 1);
              Survey.bcPos('fam', 1);
              Survey.bcPos('btl', 1);
              Survey.bcPos('vas', 1);
              Survey.bcNeg('implanon', 3);
              //Survey.bcPos('bf', 1);
              break;
            // Fewer or no periods
            case 11:
              Survey.bcNeg('abstinence', 3);
              Survey.bcPos('ocp', 1);
              //Survey.bcPos('pop', 1);
              Survey.bcNeg('ortho_evra', 3);
              Survey.bcPos('nuvaring', 1);
              Survey.bcPos('depo', 1);
              Survey.bcNeg('mcondom', 3);
              Survey.bcNeg('fcondom', 3);
              Survey.bcNeg('ccap', 3);
              Survey.bcNeg('diaph', 3);
              Survey.bcNeg('ec', 3);
              Survey.bcNeg('paragard', 3);
              Survey.bcPos('mirena', 1);
              Survey.bcNeg('withd', 3);
              Survey.bcNeg('sperm', 3);
              Survey.bcNeg('sponge', 3);
              Survey.bcNeg('fam', 3);
              Survey.bcNeg('btl', 3);
              Survey.bcNeg('vas', 3);
              Survey.bcPos('implanon', 1);
              Survey.bcPos('bf', 1);
              break;
            // Decreases symptoms from period
            case 12:
              Survey.bcNeg('abstinence', 3);
              Survey.bcPos('ocp', 1);
              Survey.bcPos('pop', 1);
              Survey.bcPos('ortho_evra', 1);
              Survey.bcPos('nuvaring', 1);
              Survey.bcPos('depo', 1);
              Survey.bcNeg('mcondom', 3);
              Survey.bcNeg('fcondom', 3);
              Survey.bcNeg('ccap', 3);
              Survey.bcNeg('diaph', 3);
              Survey.bcNeg('ec', 3);
              Survey.bcNeg('paragard', 3);
              Survey.bcPos('mirena', 1);
              Survey.bcNeg('withd', 3);
              Survey.bcNeg('sperm', 3);
              Survey.bcNeg('sponge', 3);
              Survey.bcNeg('fam', 3);
              Survey.bcNeg('btl', 3);
              Survey.bcNeg('vas', 3);
              Survey.bcPos('implanon', 1);
              Survey.bcPos('bf', 1);
              break;
          }
        }
      }
    };
    Survey.newQuestion(q21score);

    // Scoring for 'q22'
    var q22score = new Question('q22');
    q22score.score = function(args) {
      console.log("q22.score");
      var argTypes = Question.prototype.scoreArgs.call(this, args);


      if (argTypes.hasOptions) {

        args.optionList.forEach(function(option){

          var howOften = option.value
          // var howOften = args.value;

          switch (howOften)
          {
              // Every time
              case 1:
                Survey.bcPos('mcondom', 1);
                Survey.bcPos('fcondom', 1);
                Survey.bcPos('ccap', 1);
                Survey.bcPos('diaph', 1);
                Survey.bcPos('ec', 1);
                Survey.bcPos('withd', 1);
                Survey.bcPos('sperm', 1);
                Survey.bcPos('sponge', 1);
                Survey.bcPos('fam', 1);
                break;
              // Every day
              case 2:
                Survey.bcPos('ocp', 1);
                Survey.bcPos('pop', 1);
                break;
              // Once a week
              case 3:
                Survey.bcPos('ortho_evra', 1);
                break;
              // Once a month
              case 4:
                Survey.bcPos('nuvaring', 1);
                break;
              // Every 3 months
              case 5:
                Survey.bcPos('depo', 1);
                break;
              // Longer than every 3 months
              case 6:
                Survey.bcPos('paragard', 1);
                Survey.bcPos('mirena', 1);
                Survey.bcPos('implanon', 1);
                break;
              // Permanent
              case 7:
                Survey.bcPos('paragard', 1);
                Survey.bcPos('mirena', 1);
                Survey.bcPos('btl', 1);
                Survey.bcPos('vas', 1);
                Survey.bcPos('implanon', 1);
                break;
          }
        })    
      }
    };
    Survey.newQuestion(q22score);

    // Scoring for 'q23'
    var q23score = new Question('q23');
    q23score.score = function(args) {
      console.log("q23.score");
      var argTypes = Question.prototype.scoreArgs.call(this, args);
      if (argTypes.hasValue) {
        var schedBleeding = args.value;
        console.log("q23 has value", args.value);
        if (schedBleeding == 1) {
            Survey.bcPos('ocp', 1);
            Survey.bcPos('ortho_evra', 1);
            Survey.bcPos('nuvaring', 1);
            Survey.bcPos('paragard', 1);
        }
      }
    };
    Survey.newQuestion(q23score);

    // Scoring for 'q24'
    var q24score = new Question('q24');
    q24score.score = function(args) {
      console.log("q24.score");
      var argTypes = Question.prototype.scoreArgs.call(this, args);
      if (argTypes.hasValue) {
        var unschedBleeding = args.value;
        console.log("q24 has value", args.value);
        if (unschedBleeding == 2) {
            Survey.bcNeg('pop', 1);
            Survey.bcNeg('depo', 2);
            Survey.bcNeg('mirena', 2);
            Survey.bcNeg('implanon', 2);
        }
      }
    };
    Survey.newQuestion(q24score);

    // Scoring for 'q25'
    var q25score = new Question('q25');
    q25score.score = function(args) {
      console.log("q25.score");
      var argTypes = Question.prototype.scoreArgs.call(this, args);
      if (argTypes.hasValue) {
        var noBleeding = args.value;
        console.log("q25 has value", args.value);
        if (noBleeding == 1) {
            Survey.bcPos('depo', 1);
            Survey.bcPos('mirena', 1);
        }
      }
    };
    Survey.newQuestion(q25score);

    // Scoring for 'q26a'
    var q26ascore = new Question('q26a');
    q26ascore.score = function(args) {
      console.log("q26a.score");
      var argTypes = Question.prototype.scoreArgs.call(this, args);
      if (argTypes.hasValue) {
        var privatePartner = args.value;
        console.log("q26a has value", args.value);
        if (privatePartner == 1) {
          Survey.bcPos('ocp', 1);
          Survey.bcPos('pop', 1);
          Survey.bcNeg('ortho_evra', 2);
          Survey.bcNeg('nuvaring', 2);
          Survey.bcPos('depo', 1);
          Survey.bcNeg('mcondom', 3);
          Survey.bcNeg('fcondom', 3);
          Survey.bcNeg('ccap', 3);
          Survey.bcNeg('diaph', 3);
          Survey.bcPos('ec', 1);
          Survey.bcPos('paragard', 1);
          Survey.bcPos('mirena', 1);
          Survey.bcNeg('sperm', 3);
          Survey.bcNeg('sponge', 3);
          Survey.bcNeg('fam', 3);
          Survey.bcPos('btl', 1);
          Survey.bcNeg('vas', 3);
          Survey.bcPos('implanon', 1);
          Survey.bcNeg('withd', 3);
        }
      }
    };
    Survey.newQuestion(q26ascore);

    // Scoring for 'q26b'
    var q26bscore = new Question('q26b');
    q26bscore.score = function(args) {
      console.log("q26b.score");
      var argTypes = Question.prototype.scoreArgs.call(this, args);
      if (argTypes.hasValue) {
        var privateFamily = args.value;
        console.log("q26b has value", args.value);
        if (privateFamily == 1) {
          Survey.bcPos('abstinence', 1);
          Survey.bcNeg('ortho_evra', 1);
          Survey.bcPos('depo', 1);
          Survey.bcPos('paragard', 1);
          Survey.bcPos('mirena', 1);
          Survey.bcPos('fam', 1);
          Survey.bcPos('btl', 1);
          Survey.bcPos('vas', 1);
          Survey.bcPos('implanon', 1);
        }
      }
    };
    Survey.newQuestion(q26bscore);

    // Scoring for 'q27'
    var q27score = new Question('q27');
    q27score.score = function(args) {
      console.log("q27.score");
      var argTypes = Question.prototype.scoreArgs.call(this, args);
      if (argTypes.hasValue) {
        var interrupt = args.value;
        console.log("q27 has value", args.value);

        // Yes
        if (interrupt == 1) {
          Survey.bcPos('mcondom', 1);
          Survey.bcPos('fcondom', 1);
          Survey.bcPos('withd', 1);
          Survey.bcPos('sperm', 1);
          Survey.bcPos('sponge', 1);
        }

        // No
        if (interrupt == 2) {
          Survey.bcPos('ocp', 1);
          Survey.bcPos('pop', 1);
          Survey.bcPos('ortho_evra', 1);
          Survey.bcPos('nuvaring', 1);
          Survey.bcPos('depo', 1);
          Survey.bcNeg('mcondom', 3);
          Survey.bcNeg('fcondom', 3);
          Survey.bcNeg('ccap', 1);
          Survey.bcNeg('diaph', 1);
          Survey.bcPos('paragard', 1);
          Survey.bcPos('mirena', 1);
          Survey.bcNeg('withd', 3);
          Survey.bcNeg('sperm', 3);
          Survey.bcNeg('sponge', 3);
          Survey.bcPos('btl', 1);
          Survey.bcPos('vas', 1);
          Survey.bcPos('implanon', 1);
          Survey.bcPos('bf', 1);
        }
      }
    };
    Survey.newQuestion(q27score);

    // Scoring for 'q28'
    var q28score = new Question('q28');
    q28score.score = function(args) {
      console.log("q28.score");
      var argTypes = Question.prototype.scoreArgs.call(this, args);
      if (argTypes.hasValue) {
        var hadBaby = args.value;
        console.log("q28 has value", args.value);

        // No
        if (hadBaby == 2) {
          Survey.bcNeg('bf', 10);
        }
      }
    };
    Survey.newQuestion(q28score);


    // Was scoring for 'q28b'; New Scoring for 28A
    // Are you breastfeeding a child now?
    var q28ascore = new Question('q28a');
    q28ascore.score = function(args) {
      console.log("q28a.score");
      var argTypes = Question.prototype.scoreArgs.call(this, args);
      if (argTypes.hasValue) {
        var breastfeeding = args.value;
        console.log("q28a has value", args.value);

        // Yes
        if (breastfeeding == 1) {
          Survey.bcNeg('fam', 3);
          Survey.bcPos('bf', 1);
        }
      }
    };
    Survey.newQuestion(q28ascore);

    // NEW: This question is now: "HOW LONG SINCE YOU GAVE BIRTH-B?"
    var q28bscore = new Question('q28b');
    q28bscore.score = function(args) {
      console.log("q28b.score");
      var argTypes = Question.prototype.scoreArgs.call(this, args);
      if (argTypes.hasValue) {
        var sinceGaveB = args.value;
        console.log("q28b has value", args.value);

        // If gave birth-b less than 3 weeks
        if (sinceGaveB == 1) {
          Survey.bcNeg('ocp', 999);
          Survey.bcNeg('ortho_evra', 999);
          Survey.bcNeg('nuvaring', 999);
        }
         // If gave birth-b more than 3 weeks, but less than 6 weeks       
        if (sinceGaveB == 2){
          Survey.bcNeg('ocp', 3)
          Survey.bcNeg('ortho_evra', 3)
          Survey.bcNeg('nuvaring', 3)
        }
      }
    };
    Survey.newQuestion(q28bscore);

    // NEW: This question is now: "HOW LONG SINCE YOU GAVE BIRTH-C?"
    var q28cscore = new Question('q28c');
    q28cscore.score = function(args) {
      console.log("q28c.score");
      var argTypes = Question.prototype.scoreArgs.call(this, args);
      if (argTypes.hasValue) {
        var sinceGaveC = args.value;
        console.log("q28c has value", args.value);

        // If gave birth-c less than 3 weeks
        if (sinceGaveC == 1) {
          Survey.bcNeg('ocp', 999);
          Survey.bcNeg('ortho_evra', 999);
          Survey.bcNeg('nuvaring', 999);
        }
        // If gave birth-c more than 3 weeks, but less than 6 weeks
        if (sinceGaveC == 2){
          Survey.bcNeg('ocp', 3)
          Survey.bcNeg('ortho_evra', 3)
          Survey.bcNeg('nuvaring', 3)
        }
        // If gave birth-c more than 6 weeks
        if (sinceGaveC == 3){
          Survey.bcNeg('ocp', 2)
          Survey.bcNeg('ortho_evra', 2)
          Survey.bcNeg('nuvaring', 2)
        }
      }
    };
    Survey.newQuestion(q28cscore);

    // I'M ASSUMING THERE IS NO RANKING FOR THE QUESTION: "HAVE YOU HAD SURGERY IN THE PAST THREE MONTHS? OR Q29"

    // Scoring for 'q29a'
    var q29ascore = new Question('q29a');
    q29ascore.score = function(args) {
      console.log("q29a.score");
      var argTypes = Question.prototype.scoreArgs.call(this, args);
      if (argTypes.hasValue) {
        var postSurgeryMoving = args.value;
        console.log("q29a has value", args.value);
        if (postSurgeryMoving == 1) {
          Survey.bcNeg('ocp', 999);
          Survey.bcNeg('ortho_evra', 999);
          Survey.bcNeg('nuvaring', 999);
        }
      }
    };
    Survey.newQuestion(q29ascore);

    // Scoring for 'q30'
    var q30score = new Question('q30');
    q30score.score = function(args) {
      console.log("q30.score");
      var argTypes = Question.prototype.scoreArgs.call(this, args);
      if (argTypes.hasValue) {
        var highBP = args.value;
        console.log("q30 has value", args.value);

        // Yes
        if (highBP == 1) {
          Survey.bcNeg('ocp', 3);
          Survey.bcNeg('ortho_evra', 3);
          Survey.bcNeg('nuvaring', 3);
        }
      }
    };
    Survey.newQuestion(q30score);

    // Scoring for 'q30a'
    var q30ascore = new Question('q30a');
    q30ascore.score = function(args) {
      console.log("q30a.score");
      var argTypes = Question.prototype.scoreArgs.call(this, args);
      if (argTypes.hasValue) {
        var medsHighBP = args.value;
        console.log("q30a has value", args.value);

        // Yes
        if (medsHighBP == 1) {
          Survey.bcNeg('ocp', 999);
          Survey.bcNeg('ortho_evra', 999);
          Survey.bcNeg('nuvaring', 999);
        }

        // No
        if (medsHighBP == 2) {
          Survey.bcNeg('ocp', 3);
          Survey.bcNeg('ortho_evra', 3);
          Survey.bcNeg('nuvaring', 3);
        }
      }
    };
    Survey.newQuestion(q30ascore);

    // Scoring for 'q31'
    var q31score = new Question('q31');
    q31score.score = function(args) {
      console.log("q31.score");
      var argTypes = Question.prototype.scoreArgs.call(this, args);
      if (argTypes.hasValue) {
        var bloodClot = args.value;
        console.log("q31 has value", args.value);
        if (bloodClot == 1) {
          Survey.bcNeg('ocp', 999);
          Survey.bcNeg('ortho_evra', 999);
          Survey.bcNeg('nuvaring', 999);
        }
      }
    };
    Survey.newQuestion(q31score);

    // Scoring for 'q32'
    var q32score = new Question('q32');
    q32score.score = function(args) {
      console.log("q32.score");
      var argTypes = Question.prototype.scoreArgs.call(this, args);
      if (argTypes.hasValue) {
        var bloodClot = args.value;
        console.log("q32 has value", args.value);
        if (bloodClot == 1) {
          Survey.bcNeg('ocp', 999);
          Survey.bcNeg('ortho_evra', 999);
          Survey.bcNeg('nuvaring', 999);
        }
      }
    };
    Survey.newQuestion(q32score);

    // Scoring for 'q33'
    var q33score = new Question('q33');
    q33score.score = function(args) {
      console.log("q33.score");
      var argTypes = Question.prototype.scoreArgs.call(this, args);
      if (argTypes.hasValue) {
        var stroke = args.value;
        console.log("q33 has value", args.value);
        if (stroke == 1) {
          Survey.bcNeg('ocp', 999);
          Survey.bcNeg('pop', 3);
          Survey.bcNeg('ortho_evra', 999);
          Survey.bcNeg('nuvaring', 999);
          Survey.bcNeg('depo', 999);
          Survey.bcNeg('implanon', 3);
        }
      }
    };
    Survey.newQuestion(q33score);

    // Scoring for 'q34'
    var q34score = new Question('q34');
    q34score.score = function(args) {
      console.log("q34.score");
      var argTypes = Question.prototype.scoreArgs.call(this, args);
      if (argTypes.hasValue) {
        var clotting = args.value;
        console.log("q34 has value", args.value);
        if (clotting == 1) {
          Survey.bcNeg('ocp', 999);
          Survey.bcNeg('pop', 3);
          Survey.bcNeg('ortho_evra', 999);
          Survey.bcNeg('nuvaring', 999);
          Survey.bcNeg('depo', 999);
        }
      }
    };
    Survey.newQuestion(q34score);

    // Scoring for 'q35'
    var q35score = new Question('q35');
    q35score.score = function(args) {
      console.log("q35.score");
      var argTypes = Question.prototype.scoreArgs.call(this, args);
      if (argTypes.hasValue) {
        var cholesterol = args.value;
        console.log("q35 has value", args.value);
        if (cholesterol == 1) {
          Survey.bcNeg('ocp', 3);
          Survey.bcNeg('ortho_evra', 3);
          Survey.bcNeg('nuvaring', 3);
        }
      }
    };
    Survey.newQuestion(q35score);

    // Scoring for 'q36'
    var q36score = new Question('q36');
    q36score.score = function(args) {
      console.log("q36.score");
      var argTypes = Question.prototype.scoreArgs.call(this, args);
      if (argTypes.hasValue) {
        var heartAttack = args.value;
        console.log("q36 has value", args.value);
        if (heartAttack == 1) {
          Survey.bcNeg('ocp', 999);
          Survey.bcNeg('ortho_evra', 999);
          Survey.bcNeg('nuvaring', 999);
          Survey.bcNeg('depo', 999);
        }
      }
    };
    Survey.newQuestion(q36score);

    // Scoring for 'q37'
    var q37score = new Question('q37');
    q37score.score = function(args) {
      console.log("q37.score");
      var argTypes = Question.prototype.scoreArgs.call(this, args);
      if (argTypes.hasValue) {
        var heartDisease = args.value;
        console.log("q37 has value", args.value);
        if (heartDisease == 1) {
          Survey.bcNeg('ocp', 999);
          Survey.bcNeg('ortho_evra', 999);
          Survey.bcNeg('depo', 999);
          Survey.bcNeg('nuvaring', 999);
        }
      }
    };
    Survey.newQuestion(q37score);

    // Scoring for 'q38'
    var q38score = new Question('q38');
    q38score.score = function(args) {
      console.log("q38.score");
      var argTypes = Question.prototype.scoreArgs.call(this, args);
      if (argTypes.hasValue) {
        var sickle = args.value;
        console.log("q38 has value", args.value);
        if (sickle == 1) {
          Survey.bcPos('depo', 1);
        }
      }
    };
    Survey.newQuestion(q38score);

    // Scoring for 'q39'
    var q39score = new Question('q39');
    q39score.score = function(args) {
      console.log("q39.score");
      var argTypes = Question.prototype.scoreArgs.call(this, args);
      if (argTypes.hasValue) {
        var anemia = args.value;
        console.log("q39 has value", args.value);
        if (anemia == 1) {
          Survey.bcPos('ocp', 1);
          Survey.bcPos('ortho_evra', 1);
          Survey.bcPos('nuvaring', 1);
          Survey.bcPos('depo', 1);
          Survey.bcNeg('paragard', 2);
          Survey.bcPos('mirena', 1);
        }
      }
    };
    Survey.newQuestion(q39score);

    // Scoring for 'q40a'
    var q40ascore = new Question('q40a');
    q40ascore.score = function(args) {
      console.log("q40a.score");
      var argTypes = Question.prototype.scoreArgs.call(this, args);
      if (argTypes.hasValue) {
        var breastCancer = args.value;
        console.log("q40a has value", args.value);
        if (breastCancer == 1) {
          Survey.bcNeg('ocp', 999);
          Survey.bcNeg('pop', 999);
          Survey.bcNeg('ortho_evra', 999);
          Survey.bcNeg('nuvaring', 999);
          Survey.bcNeg('depo', 999);
          Survey.bcNeg('mirena', 999);
          Survey.bcNeg('implanon', 999);
        }
      }
    };
    Survey.newQuestion(q40ascore);

    // Scoring for 'q40b'
    var q40bscore = new Question('q40b');
    q40bscore.score = function(args) {
      console.log("q40b.score");
      var argTypes = Question.prototype.scoreArgs.call(this, args);
      if (argTypes.hasValue) {
        var ovarianCancer = args.value;
        console.log("q40b has value", args.value);
        if (ovarianCancer == 1) {
          Survey.bcNeg('paragard', 999);
          Survey.bcNeg('mirena', 999);
        }
      }
    };
    Survey.newQuestion(q40bscore);

    // Scoring for 'q41'
    var q41score = new Question('q41');
    q41score.score = function(args) {
      console.log("q41.score");
      var argTypes = Question.prototype.scoreArgs.call(this, args);
      if (argTypes.hasValue) {
        var molarPreg = args.value;
        console.log("q41 has value", args.value);
        if (molarPreg == 1) {
          Survey.bcNeg('paragard', 999);
          Survey.bcNeg('mirena', 999);
        }
      }
    };
    Survey.newQuestion(q41score);

    // Scoring for 'q42'
    var q42score = new Question('q42');
    q42score.score = function(args) {
      console.log("q42.score");
      var argTypes = Question.prototype.scoreArgs.call(this, args);
      if (argTypes.hasValue) {
        var pelvicTB = args.value;
        console.log("q42 has value", args.value);
        if (pelvicTB == 1) {
          Survey.bcNeg('paragard', 999);
          Survey.bcNeg('mirena', 999);
        }
      }
    };
    Survey.newQuestion(q42score);

    // Scoring for 'q43'
    var q43score = new Question('q43');
    q43score.score = function(args) {
      console.log("q43.score");
      var argTypes = Question.prototype.scoreArgs.call(this, args);
      if (argTypes.hasValue) {
        var tss = args.value;
        console.log("q43 has value", args.value);
        if (tss == 1) {
          Survey.bcNeg('ccap', 3);
          Survey.bcNeg('diaph', 3);
          Survey.bcNeg('sponge', 3);
        }
      }
    };
    Survey.newQuestion(q43score);

    // Scoring for 'q44'
    var q44score = new Question('q44');
    q44score.score = function(args) {
      console.log("q44.score");
      var argTypes = Question.prototype.scoreArgs.call(this, args);
      if (argTypes.hasValue) {
        var pid = args.value;
        console.log("q44 has value", args.value);
        if (pid == 1) {
          Survey.bcNeg('paragard', 999);
          Survey.bcNeg('mirena', 999);
        }
      }
    };
    Survey.newQuestion(q44score);

    // Scoring for 'q45'
    var q45score = new Question('q45');
    q45score.score = function(args) {
      console.log("q45.score");
      var argTypes = Question.prototype.scoreArgs.call(this, args);
      if (argTypes.hasValue) {
        var endometriosis = args.value;
        console.log("q45 has value", args.value);
        if (endometriosis == 1) {
          Survey.bcPos('ocp', 1);
          Survey.bcPos('pop', 1);
          Survey.bcPos('ortho_evra', 1);
          Survey.bcPos('nuvaring', 1);
          Survey.bcPos('depo', 1);
          Survey.bcNeg('paragard', 1);
          Survey.bcPos('mirena', 1);
          Survey.bcPos('implanon', 1);
        }
      }
    };
    Survey.newQuestion(q45score);

    // Scoring for 'q46a'
    var q46ascore = new Question('q46a');
    q46ascore.score = function(args) {
      console.log("q46a.score");
      var argTypes = Question.prototype.scoreArgs.call(this, args);
      if (argTypes.hasValue) {
        var diabetes = args.value;
        console.log("q46a has value", args.value);
        if (diabetes == 1) {
          Survey.bcNeg('ocp', 999);
          Survey.bcNeg('ortho_evra', 999);
          Survey.bcNeg('nuvaring', 999);
          Survey.bcNeg('depo', 999);
        }
      }
    };
    Survey.newQuestion(q46ascore);

    // Scoring for 'q46b'
    var q46bscore = new Question('q46b');
    q46bscore.score = function(args) {
      console.log("q46b.score");
      var argTypes = Question.prototype.scoreArgs.call(this, args);
      if (argTypes.hasValue) {
        var diabetes = args.value;
        console.log("q46b has value", args.value);
        if (diabetes == 1) {
          Survey.bcNeg('ocp', 999);
          Survey.bcNeg('ortho_evra', 999);
          Survey.bcNeg('nuvaring', 999);
          Survey.bcNeg('depo', 999);
        }
      }
    };
    Survey.newQuestion(q46bscore);


    // Scoring for 'q47a'
    var q47ascore = new Question('q47a');
    q47ascore.score = function(args) {
      console.log("q47a.score");
      var argTypes = Question.prototype.scoreArgs.call(this, args);
      if (argTypes.hasValue) {
        var aura = args.value;
        var age = Survey.answerList['q1'].value;
        console.log("q47a has value", args.value);

        // Yes
        if (aura == 1) {
          Survey.bcNeg('ocp', 999);
          Survey.bcNeg('pop', 3);
          Survey.bcNeg('ortho_evra', 999);
          Survey.bcNeg('nuvaring', 999);
          Survey.bcNeg('depo', 3);
          Survey.bcNeg('mirena', 3);
          Survey.bcNeg('implanon', 3);
        }

        // No / Migraines / Under 35
        if (aura == 2 && age < 35) {
          Survey.bcNeg('ocp', 3);
          Survey.bcNeg('ortho_evra', 3);
          Survey.bcNeg('nuvaring', 3);
        }

        // No / Migraines / Over 35
        if (aura == 2 && age >=35) {
          Survey.bcNeg('ocp', 999);
          Survey.bcNeg('ortho_evra', 999);
          Survey.bcNeg('nuvaring', 999);
        }
      }
    };
    Survey.newQuestion(q47ascore);

    // Scoring for 'q48'
    var q48score = new Question('q48');
    q48score.score = function(args) {
      console.log("q48.score");
      var argTypes = Question.prototype.scoreArgs.call(this, args);
      if (argTypes.hasValue) {
        var aids = args.value;
        console.log("q48 has value", args.value);
        if (aids == 1) {
          Survey.bcNeg('paragard', 1);
          Survey.bcNeg('mirena', 1);
        }
      }
    };
    Survey.newQuestion(q48score);

    // Scoring for 'q48b'
    var q48bscore = new Question('q48b');
    q48bscore.score = function(args) {
      console.log("q48b.score");
      var argTypes = Question.prototype.scoreArgs.call(this, args);
      if (argTypes.hasValue) {
        var gallbladder = args.value;
        console.log("q48b has value", args.value);
        if (gallbladder == 1) {
          Survey.bcNeg('ocp', 999);
          Survey.bcNeg('ortho_evra', 999);
          Survey.bcNeg('nuvaring', 999);
        }
      }
    };
    Survey.newQuestion(q48bscore);

    // Scoring for 'q49'
    var q49score = new Question('q49');
    q49score.score = function(args) {
      console.log("q49.score");
      var argTypes = Question.prototype.scoreArgs.call(this, args);
      if (argTypes.hasValue) {
        var cirrhosis = args.value;
        console.log("q49 has value", args.value);
        if (cirrhosis == 1) {
          Survey.bcNeg('ocp', 999);
          Survey.bcNeg('pop', 999);
          Survey.bcNeg('ortho_evra', 999);
          Survey.bcNeg('nuvaring', 999);
          Survey.bcNeg('depo', 999);
          Survey.bcNeg('mirena', 999);
          Survey.bcNeg('implanon', 999);
        }
      }
    };
    Survey.newQuestion(q49score);

    // Scoring for 'q50'
    var q50score = new Question('q50');
    q50score.score = function(args) {
      console.log("q50.score");
      var argTypes = Question.prototype.scoreArgs.call(this, args);
      if (argTypes.hasValue) {
        var epilepsy = args.value;
        console.log("q50 has value", args.value);
        if (epilepsy == 1) {
          Survey.bcPos('depo', 1);
        }
      }
    };
    Survey.newQuestion(q50score);

    // Scoring for 'q51'
    var q51score = new Question('q51');
    q51score.score = function(args) {
      console.log("q51.score");
      var argTypes = Question.prototype.scoreArgs.call(this, args);
      if (argTypes.hasValue) {
        var acne = args.value;
        console.log("q51 has value", args.value);
        if (acne == 1) {
          Survey.bcPos('ocp', 1);
          Survey.bcPos('ortho_evra', 1);
          Survey.bcPos('nuvaring', 1);
          Survey.bcNeg('depo', 1);
        }
      }
    };
    Survey.newQuestion(q51score);

    // Scoring for 'q52'
    var q52score = new Question('q52');
    q52score.score = function(args) {
      console.log("q52.score");
      var argTypes = Question.prototype.scoreArgs.call(this, args);
      if (argTypes.hasValue) {
        var coarseHairs = args.value;
        console.log("q52 has value", args.value);
        if (coarseHairs == 1) {
          Survey.bcPos('ocp', 1);
          Survey.bcPos('ortho_evra', 1);
          Survey.bcPos('nuvaring', 1);
        }
      }
    };
    Survey.newQuestion(q52score);

    // Scoring for 'q53a'
    var q53ascore = new Question('q53a');
    q53ascore.score = function(args) {
      console.log("q53a.score");
      var argTypes = Question.prototype.scoreArgs.call(this, args);
      if (argTypes.hasValue) {
        var stJohns = args.value;
        console.log("q53a has value", args.value);
        if (stJohns == 1) {
          Survey.bcNeg('ocp', 999);
          Survey.bcNeg('pop', 999);
          Survey.bcNeg('ortho_evra', 999);
          Survey.bcNeg('nuvaring', 999);
          Survey.bcNeg('implanon', 999);
        }
      }
    };
    Survey.newQuestion(q53ascore);

    // Scoring for 'q53b'
    var q53bscore = new Question('q53b');
    q53bscore.score = function(args) {
      console.log("q53b.score");
      var argTypes = Question.prototype.scoreArgs.call(this, args);
      if (argTypes.hasValue) {
        var rif = args.value;
        console.log("q53b has value", args.value);
        if (rif == 1) {
          Survey.bcNeg('ocp', 999);
          Survey.bcNeg('pop', 999);
          Survey.bcNeg('ortho_evra', 999);
          Survey.bcNeg('nuvaring', 999);
          Survey.bcNeg('implanon', 999);
        }
      }
    };
    Survey.newQuestion(q53bscore);

    // Scoring for 'q53c'
    var q53cscore = new Question('q53c');
    q53cscore.score = function(args) {
      console.log("q53c.score");
      var argTypes = Question.prototype.scoreArgs.call(this, args);
      if (argTypes.hasOptions) {
        var seizureMedList = args.optionList;
        var len = seizureMedList.length;
        for (var i = seizureMedList.length - 1; i >= 0; i--) {
          var seizureMed = seizureMedList[i].value
          switch (seizureMed)
          {
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
              Survey.bcNeg('ocp', 999);
              Survey.bcNeg('pop', 999);
              Survey.bcNeg('ortho_evra', 999);
              Survey.bcNeg('nuvaring', 999);
              Survey.bcNeg('implanon', 999);
              break;
          }
        }
      }
    };
    Survey.newQuestion(q53cscore);

    // Scoring for 'q58a'
    var q54ascore = new Question('q54a');
    q54ascore.score = function(args) {
      console.log("q54a.score");
      var argTypes = Question.prototype.scoreArgs.call(this, args);
      if (argTypes.hasValue) {
        var everyDay = args.value;
        console.log("q54a has value", args.value);
        if (everyDay == 1) {
          Survey.bcPos('ocp', 1);
          Survey.bcPos('pop', 1);
        }
        if (everyDay == 2) {
          Survey.bcNeg('ocp', 3);
          Survey.bcNeg('pop', 3);
        }
      }
    };
    Survey.newQuestion(q54ascore);

    // Scoring for 'q58b'
    var q54bscore = new Question('q54b');
    q54bscore.score = function(args) {
      console.log("q54b.score");
      var argTypes = Question.prototype.scoreArgs.call(this, args);
      if (argTypes.hasValue) {
        var shot3months = args.value;
        console.log("q54b has value", args.value);
        if (shot3months == 1) {
          Survey.bcPos('depo', 1);
        }
        if (shot3months == 2) {
          Survey.bcNeg('depo', 3);
        }
      }
    };
    Survey.newQuestion(q54bscore);

    // Scoring for 'q58c'
    var q54cscore = new Question('q54c');
    q54cscore.score = function(args) {
      console.log("q54c.score");
      var argTypes = Question.prototype.scoreArgs.call(this, args);
      if (argTypes.hasValue) {
        var ring = args.value;
        console.log("q54c has value", args.value);
        if (ring == 1) {
          Survey.bcPos('nuvaring', 1);
        }
        if (ring == 2) {
          Survey.bcNeg('nuvaring', 3);
        }
      }
    };
    Survey.newQuestion(q54cscore);

    // Scoring for 'q58d'
    var q54dscore = new Question('q54d');
    q54dscore.score = function(args) {
      console.log("q54d.score");
      var argTypes = Question.prototype.scoreArgs.call(this, args);
      if (argTypes.hasValue) {
        var iud = args.value;
        console.log("q54d has value", args.value);
        if (iud == 1) {
          Survey.bcPos('paragard', 1);
          Survey.bcPos('mirena', 1);
        }
        if (iud == 2) {
          Survey.bcNeg('paragard', 3);
          Survey.bcNeg('mirena', 3);
        }
      }
    };
    Survey.newQuestion(q54dscore);

    // Scoring for 'q58e'
    var q54escore = new Question('q54e');
    q54escore.score = function(args) {
      console.log("q54e.score");
      var argTypes = Question.prototype.scoreArgs.call(this, args);
      if (argTypes.hasValue) {
        var implant = args.value;
        console.log("q54e has value", args.value);
        if (implant == 1) {
          Survey.bcPos('implanon', 1);
        }
        if (implant == 2) {
          Survey.bcNeg('implanon', 3);
        }
      }
    };
    Survey.newQuestion(q54escore);

    /**
     * The questions and the behavior of each
     */
    var questions = {

      /**
       * q1:[ How old are you? ]
       */
      q1:{
        options: [
          //{ name : "I don't know",                         value : 999  },
          //{ name : "I don't want to answer this question", value : 777  },
        ],
        selectedOption : { },
        resetInputs: function(){
          this.selectedOption = {};
          this.textInput = null;
        },
        nextQuestion: function(){
          this.resetInputs();
          return 'q2';
        },
        ranking: function(){
          Survey.answer('q1', {value:this.answer});
        }
      },

      /**
       * q2:[ How much do you weigh? Please enter your weight in the number keyboard. ]
       */
      q2:{
        options: [
          //{ name : "I don't know",                         value : 999  },
          //{ name : "I don't want to answer this question", value : 777  },
        ],
        selectedOption : { },
        resetInputs: function(){
          this.selectedOption = {};
          this.textInput = undefined;
        },
        nextQuestion: function(){
          this.resetInputs();
          return 'q3';
        },
        ranking: function(){
          Survey.answer('q2', {value:this.answer});
        }
      },


      /**
       * q3:[ How often do you smoke cigarettes or cigars or use smokeless tobacco? ]
       */
      q3:{
        options: [
          { name : 'I do not use tobacco',               value : 1  },
          { name : 'I use tobacco less than once a day', value : 2  },
          { name : 'I use tobacco daily',                value : 3  },
          //{ name : "I don't know",                         value : 999  },
          //{ name : "I don't want to answer this question", value : 777  },
        ],
        selectedOption : { },
        resetInputs: function(){
          this.selectedOption = {};
        },
        nextQuestion: function(){
          this.resetInputs();
          return 'q4';
        },
        ranking: function(){
          Survey.answer('q3', {value:this.answer});
        }
      },


      /**
       * q4:[ When you are not using birth control, do you have regular monthly periods? ]
       */
      q4:{
        options: [
          { name : 'Yes', value : 1  },
          { name : 'No', value : 2  },
          { name : "I don't know",                         value : 999  },
          //{ name : "I don't want to answer this question", value : 777  },
        ],
        selectedOption : { },
        resetInputs: function(){
          this.selectedOption = {};
        },
        nextQuestion: function(){
          this.resetInputs();
          if(this.answer == 2) { return 'q4a'; }
          else { return 'q5'; }
        },
        ranking: function(){
          Survey.answer('q4', {value:this.answer});
        }
      },


      /**
       * q4a:[ Do you have three or fewer periods per year? ]
       */
      q4a:{
        options: [
          { name : 'Yes', value : 1  },
          { name : 'No', value : 2  },
          { name : "I don't know",                         value : 999  },
          //{ name : "I don't want to answer this question", value : 777  },
        ],
        selectedOption : { },
        resetInputs: function(){
          this.selectedOption = {};
        },
        nextQuestion: function(){
          this.resetInputs();
          return 'q5';
        },
        ranking: function(){
          Survey.answer('q4a', {value:this.answer});
        }
      },


      /**
       * q5:[ When you are not using birth control, do you have very heavy periods? ]
       */
      q5:{
        options: [
          { name : 'Yes', value : 1  },
          { name : 'No', value : 2  },
          { name : "I don't know",                         value : 999  },
          //{ name : "I don't want to answer this question", value : 777  },
        ],
        selectedOption : { },
        resetInputs: function(){
          this.selectedOption = {};
        },
        nextQuestion: function(){
          this.resetInputs();
          return 'q6';
        },
        ranking: function(){
          Survey.answer('q5', {value:this.answer});
        }
      },


      /**
       * q6:[ When you are not using birth control, do you have periods which last longer than 7 days? ]
       */
      q6:{
        options: [
          { name : 'Yes', value : 1  },
          { name : 'No', value : 2  },
          //{ name : "I don't know",                         value : 999  },
          //{ name : "I don't want to answer this question", value : 777  },
        ],
        selectedOption : { },
        resetInputs: function(){
          this.selectedOption = {};
        },
        nextQuestion: function(){
          this.resetInputs();
          return 'q7';
        },
        ranking: function(){
          Survey.answer('q6', {value:this.answer});
        }
      },


      /**
       * q7:[ When you are not using birth control, do you have painful periods or bad cramps during your period? ]
       */
      q7:{
        options: [
          { name : 'Yes', value : 1  },
          { name : 'No', value : 2  },
          //{ name : "I don't know",                         value : 999  },
          //{ name : "I don't want to answer this question", value : 777  },
        ],
        selectedOption : { },
        resetInputs: function(){
          this.selectedOption = {};
        },
        nextQuestion: function(){
          this.resetInputs();
          return 'q8';
        },
        ranking: function(){
          Survey.answer('q7', {value:this.answer});
        }
      },


      /**
       * q8:[ When you are not using birth control, do you have breast tenderness during your period? ]
       */
      q8:{
        options: [
          { name : 'Yes', value : 1  },
          { name : 'No', value : 2  },
          //{ name : "I don't know",                         value : 999  },
          //{ name : "I don't want to answer this question", value : 777  },
        ],
        selectedOption : { },
        resetInputs: function(){
          this.selectedOption = {};
        },
        nextQuestion: function(){
          this.resetInputs();
          return 'q9';
        },
        ranking: function(){
          Survey.answer('q8', {value:this.answer});
        }
      },


      /**
       * q9:[ When you are not using birth control, do you have depression or anxiety during your period? ]
       */
      q9:{
        options: [
          { name : 'Yes', value : 1  },
          { name : 'No', value : 2  },
          { name : "I don't know",                         value : 999  },
          //{ name : "I don't want to answer this question", value : 777  },
        ],
        selectedOption : { },
        resetInputs: function(){
          this.selectedOption = {};
        },
        nextQuestion: function(){
          this.resetInputs();
          return 'q10';
        },
        ranking: function(){
          Survey.answer('q9', {value:this.answer});
        }
      },


      /**
       * q10:[ When you are no using birth control, do you have bleeding or flouid retention during your period? ]
       */
      q10:{
        options: [
          { name : 'Yes', value : 1  },
          { name : 'No', value : 2  },
          //{ name : "I don't know",                         value : 999  },
          //{ name : "I don't want to answer this question", value : 777  },
        ],
        selectedOption : { },
        resetInputs: function(){
          this.selectedOption = {};
        },
        nextQuestion: function(){
          this.resetInputs();
          return 'q11';
        },
        ranking: function(){
          Survey.answer('q10', {value:this.answer});
        }
      },

      /**
       * q11:[ When you are not using birth control, do you have bad headaches with your period? ]
       */
      q11:{
        options: [
          { name : 'Yes', value : 1  },
          { name : 'No', value : 2  },
          //{ name : "I don't know",                         value : 999  },
          //{ name : "I don't want to answer this question", value : 777  },
        ],
        selectedOption : { },
        resetInputs: function(){
          this.selectedOption = {};
        },
        nextQuestion: function(){
          this.resetInputs();
          return 'q12';
        },
        ranking: function(){
          Survey.answer('q11', {value:this.answer});
        }
      },


      /**
       * q12:[ When you are not using birth control, do you have significant PMS? ]
       */
      q12:{
        options: [
          { name : 'Yes', value : 1  },
          { name : 'No', value : 2  },
          //{ name : "I don't know",                         value : 999  },
          //{ name : "I don't want to answer this question", value : 777  },
        ],
        selectedOption : { },
        resetInputs: function(){
          this.selectedOption = {};
        },
        nextQuestion: function(){
          this.resetInputs();
          return 'q13';
        },
        ranking: function(){
          Survey.answer('q12', {value:this.answer});
        }
      },


      /**
       * q13:[ How often do these symptoms cause you to miss work or school? ]
       */
      q13:{
        options: [
          { name : 'Rarely/Never', value : 0  },
          { name : 'Sometimes', value : 1  },
          { name : 'Almost every month', value : 2  },
          //{ name : "I don't know",                         value : 999  },
          //{ name : "I don't want to answer this question", value : 777  },
        ],
        selectedOption : { },
        resetInputs: function(){
          this.selectedOption = {};
        },
        nextQuestion: function(){
          this.resetInputs();
          return 'q14';
        },
        ranking: function(){
          Survey.answer('q13', {value:this.answer});
        }
      },


      /**
       * q14::[ How would you describe your current sexual relationship? ]
       */
      q14:{
        options: [
          { name : "Your partner and you only have sex with each other", value : 0  },
          { name : "Your partner or you have sex with other people as well", value : 1  },
          { name : "You are not sure about your partner's sexual activity outside your relationship", value : 2  },
          { name : "You are not currently having sex", value : 3 },
          //{ name : "I don't know", value : 999  },
          //{ name : "I don't want to answer this question", value : 777  },
        ],
        selectedOption : { },
        resetInputs: function(){
          this.selectedOption = {};
        },
        nextQuestion: function(){
          this.resetInputs();
          return 'q15';
        },
        ranking: function(){
          Survey.answer('q14', {value:this.answer});
        }
      },


      /**
       * q15:[ During the last 12 months how many men, if any, have you had sexual intercourse with? ]
       */
      q15:{
        options: [
          //{ name : "I don't know",                         value : 999  },
          //{ name : "I don't want to answer this question", value : 777  },
        ],
        selectedOption : { },
        resetInputs: function(){
          this.selectedOption = {};
          this.textInput = undefined;
        },
        nextQuestion: function(){
          this.resetInputs();
          return 'q16';
        },
        ranking: function(){
          Survey.answer('q15', {value:this.answer});
        }
      },


      /**
       * q16:flow_q20:[ Have you ever had an unplanned pregnancy. ]
       */
      q16:{
        options: [
          { name : 'Yes',                                  value : 1  },
          { name : 'No',                                   value : 0  },
          { name : "I don't know",                         value : 999  },
          //{ name : "I don't want to answer this question", value : 777  },
        ],
        selectedOption : { },
        resetInputs: function(){
          this.selectedOption = {};
          this.textInput = undefined;
        },
        nextQuestion: function(){
          this.resetInputs();
          if (this.answer == 1) { return 'q16a'; }
          else { return 'q17'; }
        },

        ranking: function(){
          return;
        }
      },


      /**
       * q16a:flow_q20a:[ How many unplanned pregnancies have you had? ]
       */
      q16a:{
        options: [
          //{ name : "I don't know",                         value : 999  },
          //{ name : "I don't want to answer this question", value : 777  },
        ],
        selectedOption : { },
        resetInputs: function(){
          this.selectedOption = {};
          this.textInput = undefined;
        },
        nextQuestion: function(){
          this.resetInputs();
          return 'q16b';
        },
        ranking: function(){
          return;
        }
      },


      /**
       * q16b:flow_q20b:[ Were you using any method of birth control or doing anything to prevent from getting pregnant the (first) time you had an unplanned pregnancy? ]
       */
      q16b:{
        options: [
          { name : 'Yes',                                  value : 1  },
          { name : 'No',                                   value : 0  },
          { name : "I don't know",                         value : 999  },
          //{ name : "I don't want to answer this question", value : 777  },
        ],
        selectedOption : { },
        resetInputs: function(){
          this.selectedOption = {};
        },
        nextQuestion: function(){
          this.resetInputs();
          if(this.answer == 1) { return 'q16bi'; }
          else { return 'q17'; }
        },
        ranking: function(){
          return;
        }
      },

      /**
       * q16bi:[ The (first) time you had an unplanned preganancy, what method of birth control were you using? I will show you four screens that have different birth control methods. Please choose ALL the methods you were using ]
       */
      q16bi:{
        options: [
          { name : 'Birth Control Pill',  value : 1  ,pregnancy:[]},
          { name : 'Mini Pills',     value : 2  ,pregnancy:[]},
          { name : 'Ortho Evra (Patch)',     value : 3  ,pregnancy:[]},
          { name : 'Nuva Ring',      value : 4  ,pregnancy:[]},
          { name : 'Depo Provera (Shot)',   value : 5  ,pregnancy:[]},
          { name : 'Male Condom',    value : 6  ,pregnancy:[]},
          { name : 'Diaphragm',      value : 7  ,pregnancy:[]},
          { name : 'Female Condom',  value : 8  ,pregnancy:[]},
          { name : 'Sponge',         value : 9  ,pregnancy:[]},
          { name : 'Natural Family Planning',            value : 10 ,pregnancy:[]},
          { name : 'Emergency Contraceptive Pills',             value : 11 ,pregnancy:[]},
          { name : 'Paragard (Copper T IUD)',       value : 12 ,pregnancy:[]},
          { name : 'Mirena (Hormonal IUD)',         value : 13 ,pregnancy:[]},
          { name : 'Withdrawal',     value : 14 ,pregnancy:[]},
          { name : 'Spermicide',     value : 15 ,pregnancy:[]},
          { name : 'Tubes Tied (Sterilization for Women)',     value : 16 ,pregnancy:[]},
          { name : 'Vasectomy (Sterilization for Men)',      value : 17 ,pregnancy:[]},
          { name : 'Implant (Norplant, Implanon)',        value : 18 ,pregnancy:[]},
          { name : 'Breast Feeding', value : 19 ,pregnancy:[]},
          { name : 'Abstinence',     value : 20 ,pregnancy:[]}
        ],
        selectedOptions: [ ],
        toggleCheck: function(option) {
          if (this.selectedOptions.indexOf(option) == -1) {
            this.selectedOptions.push(option);
          } else {
            this.selectedOptions.splice(this.selectedOptions.indexOf(option),1);
          }
        },
        togglePregnancy: function(option,pregnancy){
          var index = this.selectedOptions.indexOf(option)
          var optionPreg = this.selectedOptions[index].pregnancy
         
          if (optionPreg.indexOf(pregnancy) == -1) {
            optionPreg.push(pregnancy);
          } else {
            optionPreg.splice(optionPreg.indexOf(pregnancy),1);
          }
        },
        resetInputs: function(){
          while (this.selectedOptions.length) {
            this.selectedOptions.pop();
          }
        },
        nextQuestion: function(){
          this.resetInputs();
          return 'q17';
        },
        ranking: function(){
          if(this.answer && this.answer.array){

            //convert anwer array to account for # of pregnancies
            //for each pregnancy add another element of the option
            var convertedArray=[]
            this.answer.array.forEach(function(el){

              var pregnancies = el.pregnancy? el.pregnancy.length : 0
              pregnancies = Math.max(1,pregnancies)
              for(var p=0;p<pregnancies;p++){
                convertedArray.push(el)
              }
            })


            Survey.answer('q16bi', {optionList:convertedArray});
          }
        },
      },

      /**
       * q17:[ Now I'm going to ask you about different birth control methods that you might be interested in using now. I will show you four screens that have different birth control methods. You can choose as many methods as you would like ]
       */
      q17:{
        options: [
          { name : 'Abstinence',     value : 1  },
          { name : 'Birth Control Pill',  value : 2  },
          { name : 'Mini Pills',     value : 3  },
          { name : 'Ortho Evra (Patch)',     value : 4  },
          { name : 'Nuva Ring',      value : 5  },
          { name : 'Depo Provera (Shot)',   value : 6  },
          { name : 'Male Condom',    value : 7  },
          { name : 'Diaphragm',      value : 8  },
          { name : 'Female Condom',  value : 9  },
          { name : 'Sponge',         value : 10  },
          { name : 'Natural Family Planning',            value : 11 },
          { name : 'Emergency Contraceptive Pills',             value : 12 },
          { name : 'Paragard (Copper T IUD)',       value : 13 },
          { name : 'Mirena (Hormonal IUD)',         value : 14 },
          { name : 'Withdrawal',     value : 15 },
          { name : 'Spermicide',     value : 16 },
          { name : 'Tubes Tied (Sterilization for Women)',     value : 17 },
          { name : 'Vasectomy (Sterilization for Men)',      value : 18 },
          { name : 'Implant (Norplant, Impanon)',        value : 19 },
          { name : 'Breast Feeding', value : 20 }
        ],
        selectedOptions: [ ],
        toggleCheck: function(option) {
          if (this.selectedOptions.indexOf(option) == -1) {
            this.selectedOptions.push(option);
          } else {
            this.selectedOptions.splice(this.selectedOptions.indexOf(option),1);
          }
        },
        resetInputs: function(){
          while (this.selectedOptions.length) {
            this.selectedOptions.pop();
          }
        },
        nextQuestion: function(){
          this.resetInputs();
          return 'q18';
        },
        ranking: function(){
          if(this.answer && this.answer.array){
            Survey.answer('q17', {optionList:this.answer.array});
          }
        },
      },


      /**
       * q18:flow_22:[ Have you EVER used any method of birth control? ]
       */
      q18:{
        options: [
          { name : 'Yes', value : 1  },
          { name : 'No', value : 2  },
          { name : "I don't know",                         value : 999  },
          //{ name : "I don't want to answer this question", value : 777  },
        ],
        selectedOption : { },
        resetInputs: function(){
          this.selectedOption = {};
        },
        nextQuestion: function(){
          this.resetInputs();
          if(this.answer == 1) { return 'q18a'; }
          else { return 'q20'; }
        },
        ranking: function(){
          return;
        }
      },


      /**
       * q18a:flow_22a:[ Are you using birth control now? ]
       */
      q18a:{
        options: [
          { name : 'Yes', value : 1  },
          { name : 'No', value : 2  },
          //{ name : "I don't know",                         value : 999  },
          //{ name : "I don't want to answer this question", value : 777  },
        ],
        selectedOption : { },
        resetInputs: function(){
          this.selectedOption = {};
        },
        nextQuestion: function(){
          this.resetInputs();
          if(this.answer == 1) { return 'q18ai'; }
          else { return 'q19'; }
        },
        ranking: function(){

          return;
        }
      },


      /**
       * q18ai:flow_22ai:[ What birth control method are you using now? I will show you four screens that have different birth control methods. Please choose ALL the methods your are using now? ]
       */
      q18ai:{
        options: [
          { name : 'Abstinence',     value : 1  },
          { name : 'Birth Control Pill',  value : 2  },
          { name : 'Mini Pills',     value : 3  },
          { name : 'Ortho Evra (Patch)',     value : 4  },
          { name : 'Nuva Ring',      value : 5  },
          { name : 'Depo Provera (Shot)',   value : 6  },
          { name : 'Male Condom',    value : 7  },
          { name : 'Diaphragm',      value : 8  },
          { name : 'Female Condom',  value : 9  },
          { name : 'Sponge',         value : 10  },
          { name : 'Natural Family Planning',            value : 11 },
          { name : 'Emergency Contraceptive Pills',             value : 12 },
          { name : 'Paragard (Copper T IUD)',       value : 13 },
          { name : 'Mirena (Hormonal IUD)',         value : 14 },
          { name : 'Withdrawal',     value : 15 },
          { name : 'Spermicide',     value : 16 },
          { name : 'Tubes Tied (Sterilization for Women)',     value : 17 },
          { name : 'Vasectomy (Sterilization for Men)',      value : 18 },
          { name : 'Implant (Norplant, Implanon)',        value : 19 },
          { name : 'Breast Feeding', value : 20 }
        ],
        selectedOptions: [ ],
        toggleCheck: function(option) {
          if (this.selectedOptions.indexOf(option) == -1) {
            this.selectedOptions.push(option);
          } else {
            this.selectedOptions.splice(this.selectedOptions.indexOf(option),1);
          }
        },
        resetInputs: function(){
          while (this.selectedOptions.length) {
            this.selectedOptions.pop();
          }
        },
        nextQuestion: function(){
          this.resetInputs();
          return 'q19';
        },
        ranking: function(){
          if(this.answer && this.answer.array){
            Survey.answer('q18ai', {optionList:this.answer.array});
          }
        },
      },


      //
      /**
       * q19:[ Have you EVER used a birth control method that you didn't like, that didn't work, or that you had other problems with? ]
       */
      q19:{
        options: [
          { name : 'Yes', value : 1  },
          { name : 'No', value : 2  },
          { name : "I don't know",                         value : 999  },
          //{ name : "I don't want to answer this question", value : 777  },
        ],
        selectedOption : { },
        resetInputs: function(){
          this.selectedOption = {};
        },
        nextQuestion: function(){
          this.resetInputs();
          if(this.answer == 1) { return 'q19a'; }
          else { return 'q20'; }
        },
        ranking: function(){

          return;
        }
      },

      /**
       * q19a:flow_23a:[ What method did you have a problem with? I will show you 4 screens  ]
       */
      q19a:{
        options: [
          { name : 'Birth Control Pill',  value : 1  },
          { name : 'Mini Pills',     value : 2  },
          { name : 'Ortho Evra (Patch)',     value : 3  },
          { name : 'Nuva Ring',      value : 4  },
          { name : 'Depo Provera (Shot)',   value : 5  },
          { name : 'Male Condom',    value : 6  },
          { name : 'Diaphragm',      value : 7  },
          { name : 'Female Condom',  value : 8  },
          { name : 'Sponge',         value : 9  },
          { name : 'Natural Family Planning',            value : 10 },
          { name : 'Emergency Contraceptive Pills',             value : 11 },
          { name : 'Paragard (Copper T IUD)',       value : 12 },
          { name : 'Mirena (Hormonal IUD)',         value : 13 },
          { name : 'Withdrawal',     value : 14 },
          { name : 'Spermicide',     value : 15 },
          { name : 'Tubes Tied (Sterilization for Women)',     value : 16 },
          { name : 'Vasectomy (Sterilization for Men)',      value : 17 },
          { name : 'Implant (Norplant, Implanon)',        value : 18 },
          { name : 'Breast Feeding', value : 19 },
          { name :  'Abstinence',    value : 20 }
          // { name : 'Abstinence',     value : 1  },
          // { name : 'Birth Control',  value : 2  },
          // { name : 'Mini Pills',     value : 3  },
          // { name : 'Ortho Evra',     value : 4  },
          // { name : 'Nuva Ring',      value : 5  },
          // { name : 'Depo Provera',   value : 6  },
          // { name : 'Male Condom',    value : 7  },
          // { name : 'Diaphragm',      value : 8  },
          // { name : 'Female Condom',  value : 9  },
          // { name : 'Sponge',         value : 10  },
          // { name : 'Fam',            value : 11 },
          // { name : 'EC',             value : 12 },
          // { name : 'Paragard',       value : 13 },
          // { name : 'Mirena',         value : 14 },
          // { name : 'Withdrawal',     value : 15 },
          // { name : 'Spermicide',     value : 16 },
          // { name : 'Tubes Tied',     value : 17 },
          // { name : 'Vasectomy',      value : 18 },
          // { name : 'Implant',        value : 19 },
          // { name : 'Breast Feeding', value : 20 }
        ],
        selectedOptions: [],
        toggleCheck: function(option) {
          if (this.selectedOptions.indexOf(option) == -1) {
            this.selectedOptions.push(option);
          } else {
            this.selectedOptions.splice(this.selectedOptions.indexOf(option),1);
          }
        },
        clearSelections: function() {
          while (this.selectedOptions.length) {
            this.selectedOptions.pop();
          }
        },
        saveSelections: function() {
          this.answer.problems= problems
          problems.bcProblemList = this.selectedOptions.splice(0);

          // this.answer.problems = this.selectedOptions.splice(0);
        },
        nextQuestion: function(){
          this.saveSelections();
          this.clearSelections();
          return 'q19ai';
        },
        ranking: function(){
          return;
        }
      },

      /**
       * q19ai:[ What problems did you have while using ___ ? ]
       */
      q19ai:{
        options: [
          { value : 1, name : "Breast Tenderness" },
          { value : 2, name : "Cramping or pain" },
          { value : 3, name : "Hair Loss" },
          { value : 4, name : "Depression or mood swings" },
          { value : 5, name : "Nausea or vomiting" },
          { value : 6, name : "Weight gain" },
          { value : 7, name : "Migraines or very bad headaches" },
          { value : 8, name : "Discharge" },
          { value : 9, name : "Other changes to my body" },
          { value : 10, name : "I couldn't get to the clinic" },
          { value : 11, name : "I couldn't get to the pharmacy" },
          { value : 12, name : "It was too expensive" },
          { value : 13, name : "I had another problem getting the birth control" },
          { value : 14, name : "I forgot to take it or missed too many doses" },
          { value : 15, name : "I failed to restart after break for period" },
          { value : 16, name : "I didn't use it every time I had sex" },
          { value : 17, name : "I had another problem using it correctly" },
          { value : 18, name : "I got pregnant" },
          { value : 19, name : "High blood pressure" },
          { value : 20, name : "Blood clot in vein or lungs" },
          { value : 21, name : "Stroke or heart attack" },
          { value : 22, name : "Another health problem" },
          { value : 23, name : "I didn't like the prolonged bleeding" },
          { value : 24, name : "I didn't like the heavy bleeding" },
          { value : 25, name : "I didn't like the irregular bleeding" },
          { value : 26, name : "I didn't like the absence of bleeding" },
          { value : 27, name : "I didn't like something else about my periods" },
          { value : 28, name : "My partner didn't like it" },
          //{ value : 777, name : "I don't know" },
          //{ value : 999, name : "I don't want to answer this question" },
        ],
        curBcProbName : function() {
          if(!questions['q19a'].answer)
            return false;
          var problems = questions['q19a'].answer.problems
          var curBcNum = problems.curBcProbNum;
          var listLen = problems.bcProblemList.length;
          var curBcProbTuple = undefined;
          if (curBcNum < listLen)
          {
            curBcProbTuple = problems.bcProblemList[curBcNum];
          }
          if (curBcProbTuple != undefined) {
            return curBcProbTuple.name;
          } else {
            return '';
          }
        },
        notDone: function() {
          var problems = questions['q19a'].answer.problems
          return (problems.curBcProbNum < problems.bcProblemList.length);
        },
        selectedOptions: [],
        toggleCheck: function(option) {
          if (this.selectedOptions.indexOf(option) == -1) {
            this.selectedOptions.push(option);
          } else {
            this.selectedOptions.splice(this.selectedOptions.indexOf(option),1);
          }
        },
        clearSelections: function() {
          while (this.selectedOptions.length) {
            this.selectedOptions.pop();
          }
        },
        saveSelections: function() {
          var problems = questions['q19a'].answer.problems
          var curBcProbName = this.curBcProbName();

          //store answeres from each loop in problems
          questions['q19a'].answer.problems.problemsPerBc[curBcProbName]= this.selectedOptions.splice(0);
          // problems.problemsPerBc[curBcProbName] = this.selectedOptions.splice(0);
        },
        nextQuestion: function(){
          this.saveSelections();
          this.clearSelections();

          var problems = questions['q19a'].answer.problems
          problems.curBcProbNum += 1;

          if (this.notDone()) { return 'q19ai'; }
          else { return 'q20'; }
        },
        ranking: function(){
          //compute ranking only after the loop has finished
          if(this.answer && this.answer.array && questions['q19a'].answer.problems){

            var problems = questions['q19a'].answer.problems

            //loop through all problems and push them into an array
            var answer=[]
            for(var i=0;i<problems.bcProblemList.length;i++){
              var curBcNum = i;

              var problemValue = problems.bcProblemList[curBcNum].value;
              var problemName = problems.bcProblemList[curBcNum].name;

              //get the answers for this problem
              var problemsPerBc = problems.problemsPerBc[problems.bcProblemList[curBcNum].name]

              answer.push(
                  {value:problemValue,
                    name:problemName,
                    optionList:problemsPerBc}
                )

            }

            Survey.answer('q19ai', answer);

          }
        },
      },


      /**
       * q20:[ When would you like to become pregnant (in years)? ]
       */
      q20:{
        options: [
          { value : 1, name : 'Less than one year' },
          { value : 2, name : 'In one to three years' },
          { value : 3, name : 'In three or more years' },
          { value : 4, name : 'Not sure when but definitely want a baby' },
          { value : 5, name : 'Never' },
          //{ value : 777, name : "I don't know" },
          //{ value : 999, name : "I don't want to answer this question" },
        ],
        selectedOption : { },
        resetInputs: function(){
          this.selectedOption = {};
        },
        nextQuestion: function(){
          this.resetInputs();
          return 'q21';
        },
        ranking: function(){
          Survey.answer('q20', {value:this.answer});
        }
      },


      /**
       * q21:[ What is most important when choosing a birth control method? Please select the three most important to you? ]
       */
      q21:{
        options: [
          { value : 1, name : 'Easy to use' },
          { value : 2, name : 'Safe with breast feeding' },
          { value : 3, name : 'Inexpensive' },
          { value : 4, name : 'Very effective' },
          { value : 5, name : 'Able to get pregnant quickly after stopping use of method' },
          { value : 6, name : 'Not very many side-effects' },
          { value : 7, name : 'No hormones' },
          { value : 8, name : 'Effective long term meaning three months or longer' },
          { value : 9, name : 'Do not need to interrupt sexual activity' },
          { value : 10, name : 'Able to give regular monthly periods' },
          { value : 11, name : 'Gives fewer or no periods' },
          { value : 12, name : 'Decreases symptoms from period' },
          { value : 777, name : "I don't know" },
          //{ value : 999, name : "I don't want to answer this question" },
        ],
        selectedOptions: [ ],
        toggleCheck: function(option) {
          if (this.selectedOptions.indexOf(option) == -1) {
            this.selectedOptions.push(option);
          } else {
            this.selectedOptions.splice(this.selectedOptions.indexOf(option),1);
          }
        },
        resetInputs: function(){
          this.selectedOption = {};
        },
        nextQuestion: function(){
          this.resetInputs();
          return 'q22';
        },
        ranking: function(){
          if(this.answer && this.answer.array){
            Survey.answer('q21', {optionList:this.answer.array});
          }
        }
      },


      /**
       * q22NEW:[ Please select on this timeline how often you want to think about and take action for you birth control method? ]
      **/
      q22:{
        options: [
          { value : 1, name : 'Every time you have sex' },
          { value : 2, name : 'Every day' },
          { value : 3, name : 'Once a week' },
          { value : 4, name : 'Once a month' },
          { value : 5, name : 'Every three months' },
          { value : 6, name : 'Longer than every three months' },
          { value : 7, name : 'Permanent method' },
          { value : 777, name : "I don't know" },
          //{ value : 999, name : "I don't want to answer this question" },
        ],
        selectedOptions: [ ],
        toggleCheck: function(option) {
          if (this.selectedOptions.indexOf(option) == -1) {
            this.selectedOptions.push(option);
          } else {
            this.selectedOptions.splice(this.selectedOptions.indexOf(option),1);
          }
        },
        resetInputs: function(){
          this.selectedOption = {};
        },
        nextQuestion: function(){
          this.resetInputs();
          return 'q23';
        },
        ranking: function(){
          if(this.answer && this.answer.array){
          Survey.answer('q22', {optionList:this.answer.array});
          }
        }
      },

      /**
       * q23:[ Would you be okay with regular scheduled bleeding? ]
       */
      q23:{
        options: [
          { name : "Yes", value : 1  },
          { name : "No", value : 2  },
          { name : "I don't know",                         value : 999  },
          //{ name : "I don't want to answer this question", value : 777  },
        ],
        selectedOption : { },
        resetInputs: function(){
          this.selectedOption = {};
        },
        nextQuestion: function(){
          this.resetInputs();
          return 'q24';
        },
        ranking: function(){
          Survey.answer('q23', {value:this.answer});
        }
      },


      /**
       * q24:[ Would you be okay with unscheduled bleeding and/or spotting? ]
       */
      q24:{
        options: [
          { name : 'Yes', value : 1  },
          { name : 'No', value : 2  },
          { name : "I don't know",                         value : 999  },
          //{ name : "I don't want to answer this question", value : 777  },
        ],
        selectedOption : { },
        resetInputs: function(){
          this.selectedOption = {};
        },
        nextQuestion: function(){
          this.resetInputs();
          return 'q25';
        },
        ranking: function(){
          Survey.answer('q24', {value:this.answer});
        }
      },

      // Would you be okay with no bleeding at all?
      q25:{
        options: [
          { name : 'Yes', value : 1  },
          { name : 'No', value : 2  },
          { name : "I don't know",                         value : 999  },
          //{ name : "I don't want to answer this question", value : 777  },
        ],
        selectedOption : { },
        resetInputs: function(){
          this.selectedOption = {};
        },
        nextQuestion: function(){
          this.resetInputs();
          return 'q26';
        },
        ranking: function(){
          Survey.answer('q25', {value:this.answer});
        }
      },

      // Do you need a birth control method which you can keep private?
      q26:{
        options: [
          { name : 'Yes', value : 1  },
          { name : 'No', value : 2  },
          { name : "I don't know",                         value : 999  },
          //{ name : "I don't want to answer this question", value : 777  },
        ],
        selectedOption : { },
        resetInputs: function(){
          this.selectedOption = {};
        },
        nextQuestion: function(){
          this.resetInputs();
          if(this.answer == 1) { return 'q26a'; }
          else { return 'q27'; }
        },
        ranking: function(){
          return;
        }
      },


      // Do you want to keep it private from your boyfriend/girlfriend/partner?
      q26a:{
        options: [
          { name : 'Yes', value : 1  },
          { name : 'No', value : 2  },
          { name : "I don't know",                         value : 999  },
          //{ name : "I don't want to answer this question", value : 777  },
        ],
        selectedOption : { },
        resetInputs: function(){
          this.selectedOption = {};
        },
        nextQuestion: function(){
          this.resetInputs();
          return 'q26b';
        },
        ranking: function(){
          Survey.answer('q26a', {value:this.answer});
        }
      },

      // Do you want to keep it private from your family or your friends?
      q26b:{
        options: [
          { name : 'Yes', value : 1  },
          { name : 'No', value : 2  },
          { name : "I don't know",                         value : 999  },
          //{ name : "I don't want to answer this question", value : 777  },
        ],
        selectedOption : { },
        resetInputs: function(){
          this.selectedOption = {};
        },
        nextQuestion: function(){
          this.resetInputs();
          return 'q27';
        },
        ranking: function(){
          Survey.answer('q26b', {value:this.answer});
        }
      },


      // Would it be OK for you to use a birth control method that you have to interrupt sexual activity to use?
      q27:{
        options: [
          { name : 'Yes', value : 1  },
          { name : 'No', value : 2  },
          { name : "I don't know",                         value : 999  },
          //{ name : "I don't want to answer this question", value : 777  },
        ],
        selectedOption : { },
        resetInputs: function(){
          this.selectedOption = {};
        },
        nextQuestion: function(){
          this.resetInputs();
          return 'q28';
        },
        ranking: function(){
          Survey.answer('q27', {value:this.answer});
        }
      },


      // *******************************************************
      //
      // This begins the first question of the new section
      //
      // *******************************************************


      // Have you had a baby in the last 6 months?
      q28:{
        options: [
          { name : 'Yes', value : 1  },
          { name : 'No', value : 2  },
          //{ name : "I don't know",                         value : 999  },
          //{ name : "I don't want to answer this question", value : 777  },
        ],
        selectedOption : { },
        resetInputs: function(){
          this.selectedOption = {};
        },
        ranking: function(){
          Survey.answer('q28', {value:this.answer});
        },
        nextQuestion: function(){
          this.resetInputs();
          if (this.answer == 1) { return 'q28a'; }
          else { return 'q29'; }
        }
      },

      // Are you breastfeeding your baby now?
      q28a:{
        options: [
          { name : 'Yes', value : 1  },
          { name : 'No', value : 2  },
          //{ name : "I don't know",                         value : 999  },
          //{ name : "I don't want to answer this question", value : 777  },
        ],
        selectedOption : { },
        resetInputs: function(){
          this.selectedOption = {};
        },
        ranking: function(){
          Survey.answer('q28a', {value:this.answer});
        },
        nextQuestion: function(){
          this.resetInputs();
          if (this.answer == 1) { return 'q28c'}
            else { return 'q28b'}
        }
      },

      // How long since you gave birth-B?
      q28b:{
        options: [
          { value : 1, name : 'Less than 3 weeks' },
          { value : 2, name : 'More than 3 weeks, but less than 6 weeks' },
        ],
        selectedOption : { },
        resetInputs: function(){
          this.selectedOption = {};
        },
        ranking: function(){
          Survey.answer('q28b', {value:this.answer});
        },
        nextQuestion: function(){
          this.resetInputs();
          return 'q29';
        }
      },

      // How long since you gave birth-C?
      q28c:{
        options: [
          { value : 1, name : 'Less than 3 weeks' },
          { value : 2, name : 'More than 3 weeks, but less than 6 weeks' },
          { value : 3, name : 'More than 6 weeks' },
        ],
        selectedOption : { },
        resetInputs: function(){
          this.selectedOption = {};
        },
        ranking: function(){
          Survey.answer('q28c', {value:this.answer});
        },
        nextQuestion: function(){
          this.resetInputs();
          return 'q29';
        }
      },


      // Have you had surgery in the past three months?
      q29:{
        options: [
          { name : 'Yes', value : 1  },
          { name : 'No', value : 2  },
          //{ name : "I don't know",                         value : 999  },
          //{ name : "I don't want to answer this question", value : 777  },
        ],
        selectedOption : { },
        resetInputs: function(){
          this.selectedOption = {};
        },
        ranking: function(){
          return;
        },
        nextQuestion: function(){
          this.resetInputs();
          if (this.answer == 1) { return 'q29a'; }
          else { return 'q30'; }
        }
      },

      // Is it hard moving around because of the surgery?
      q29a:{
        options: [
          { name : 'Yes', value : 1  },
          { name : 'No', value : 2  },
          //{ name : "I don't know",                         value : 999  },
          //{ name : "I don't want to answer this question", value : 777  },
        ],
        selectedOption : { },
        resetInputs: function(){
          this.selectedOption = {};
        },
        ranking: function(){
          Survey.answer('q29a', {value:this.answer});
        },
        nextQuestion: function(){
          this.resetInputs();
          return 'q30';
        }
      },

      // Has a doctor, nurse or health professional EVER told you that you had high blood pressure,
      // also called hypertension?
      q30:{
        options: [
          { name : 'Yes', value : 1  },
          { name : 'No', value : 2  },
          //{ name : "I don't know",                         value : 999  },
          //{ name : "I don't want to answer this question", value : 777  },
        ],
        selectedOption : { },
        resetInputs: function(){
          this.selectedOption = {};
        },
        ranking: function(){
          Survey.answer('q30', {value:this.answer});
        },
        nextQuestion: function(){
          this.resetInputs();
          if (this.answer == 1) { return 'q30a'; }
          else { return 'q31'; }
        }
      },

      // Are you currently taking medicine for high blood pressure?
      q30a:{
        options: [
          { name : 'Yes', value : 1  },
          { name : 'No', value : 2  },
          { name : "I don't know",                         value : 999  },
          //{ name : "I don't want to answer this question", value : 777  },
        ],
        selectedOption : { },
        resetInputs: function(){
          this.selectedOption = {};
        },
        ranking: function(){
          Survey.answer('q30a', {value:this.answer});
        },
        nextQuestion: function(){
          this.resetInputs();
          return 'q31';
        }
      },

      // Has a doctor, nurse, or other health professional EVER told you that you had blood clots, also called clot
      // in a vein or DVT?
      q31:{
        options: [
          { name : 'Yes', value : 1  },
          { name : 'No', value : 2  },
          //{ name : "I don't know",                         value : 999  },
          //{ name : "I don't want to answer this question", value : 777  },
        ],
        selectedOption : { },
        resetInputs: function(){
          this.selectedOption = {};
        },
        ranking: function(){
          Survey.answer('q31', {value:this.answer});
        },
        nextQuestion: function(){
          this.resetInputs();
          return 'q32';
        }
      },

      // Has a doctor, nurse, or other health professional EVER told you that you had pulmonary embolus,
      // also called a clot in the lung?
      q32:{
        options: [
          { name : 'Yes', value : 1  },
          { name : 'No', value : 2  },
          //{ name : "I don't know",                         value : 999  },
          //{ name : "I don't want to answer this question", value : 777  },
        ],
        selectedOption : { },
        resetInputs: function(){
          this.selectedOption = {};
        },
        ranking: function(){
          Survey.answer('q32', {value:this.answer});
        },
        nextQuestion: function(){
          this.resetInputs();
          return 'q33';
        }
      },

      // Has a doctor, nurse, or other health professional EVER told you that you had a stroke?
      q33:{
        options: [
          { name : 'Yes', value : 1  },
          { name : 'No', value : 2  },
          //{ name : "I don't know",                         value : 999  },
          //{ name : "I don't want to answer this question", value : 777  },
        ],
        selectedOption : { },
        resetInputs: function(){
          this.selectedOption = {};
        },
        ranking: function(){
          Survey.answer('q33', {value:this.answer});
        },
        nextQuestion: function(){
          this.resetInputs();
          return 'q34';
        }
      },

      // Has a doctor, nurse, or other health professional EVER told you that you had a clotting disorder?
      q34:{
        options: [
          { name : 'Yes', value : 1  },
          { name : 'No', value : 2  },
          //{ name : "I don't know",                         value : 999  },
          //{ name : "I don't want to answer this question", value : 777  },
        ],
        selectedOption : { },
        resetInputs: function(){
          this.selectedOption = {};
        },
        ranking: function(){
          Survey.answer('q34', {value:this.answer});
        },
        nextQuestion: function(){
          this.resetInputs();
          return 'q35';
        }
      },

      // Has a doctor, nurse, or other health professional EVER told you that you had
      // high cholesterol?
      q35:{
        options: [
          { name : 'Yes', value : 1  },
          { name : 'No', value : 2  },
          //{ name : "I don't know",                         value : 999  },
          //{ name : "I don't want to answer this question", value : 777  },
        ],
        selectedOption : { },
        resetInputs: function(){
          this.selectedOption = {};
        },
        ranking: function(){
          Survey.answer('q35', {value:this.answer});
        },
        nextQuestion: function(){
          this.resetInputs();
          return 'q36';
        }
      },


      // Has a doctor, nurse, or other health professional EVER told you that you had a heart
      // attach, also called a myocardial infarction, heart disease or vascular disease?
      q36:{
        options: [
          { name : 'Yes', value : 1  },
          { name : 'No', value : 2  },
          //{ name : "I don't know",                         value : 999  },
          //{ name : "I don't want to answer this question", value : 777  },
        ],
        selectedOption : { },
        resetInputs: function(){
          this.selectedOption = {};
        },
        ranking: function(){
          Survey.answer('q36', {value:this.answer});
        },
        nextQuestion: function(){
          this.resetInputs();
          return 'q37';
        }
      },

      // Has a doctor, nurse, or other health professional EVER told you that you had complicated
      // valvular heart disease?
      q37:{
        options: [
          { name : 'Yes', value : 1  },
          { name : 'No', value : 2  },
          //{ name : "I don't know",                         value : 999  },
          //{ name : "I don't want to answer this question", value : 777  },
        ],
        selectedOption : { },
        resetInputs: function(){
          this.selectedOption = {};
        },
        ranking: function(){
          Survey.answer('q37', {value:this.answer});
        },
        nextQuestion: function(){
          this.resetInputs();
          return 'q38';
        }
      },

      // Has a doctor, nurse, or other health professional EVER told you that you had
      // sickle cell anemia?
      q38:{
        options: [
          { name : 'Yes', value : 1  },
          { name : 'No', value : 2  },
          //{ name : "I don't know",                         value : 999  },
          //{ name : "I don't want to answer this question", value : 777  },
        ],
        selectedOption : { },
        resetInputs: function(){
          this.selectedOption = {};
        },
        ranking: function(){
          Survey.answer('q38', {value:this.answer});
        },
        nextQuestion: function(){
          this.resetInputs();
          return 'q39';
        }
      },

      // Has a doctor, nurse, or other health professional EVER told you that you
      // had anemia, sometimes called low blood or tired blood?
      q39:{
        options: [
          { name : 'Yes', value : 1  },
          { name : 'No', value : 2  },
          //{ name : "I don't know",                         value : 999  },
          //{ name : "I don't want to answer this question", value : 777  },
        ],
        selectedOption : { },
        resetInputs: function(){
          this.selectedOption = {};
        },
        ranking: function(){
          Survey.answer('q39', {value:this.answer});
        },
        nextQuestion: function(){
          this.resetInputs();
          return 'q40';
        }
      },

      // Has a doctor, nurse, or other health professional EVER told you that you had
      // cancer or a malignancy of any kind?
      q40:{
        options: [
          { name : 'Yes', value : 1  },
          { name : 'No', value : 2  },
          //{ name : "I don't know",                         value : 999  },
          //{ name : "I don't want to answer this question", value : 777  },
        ],
        selectedOption : { },
        resetInputs: function(){
          this.selectedOption = {};
        },
        ranking: function(){
          return;
        },
        nextQuestion: function(){
          this.resetInputs();
          if (this.answer == 1) { return 'q40a'; }
          else { return 'q41'; }
        }
      },

      // Have you ever had breast cancer, liver tumors or liver cancer?
      q40a:{
        options: [
          { name : 'Yes', value : 1  },
          { name : 'No', value : 2  },
          //{ name : "I don't know",                         value : 999  },
          //{ name : "I don't want to answer this question", value : 777  },
        ],
        selectedOption : { },
        resetInputs: function(){
          this.selectedOption = {};
        },
        ranking: function(){
          Survey.answer('q40a', {value:this.answer});
        },
        nextQuestion: function(){
          this.resetInputs();
          return 'q40b';
        }
      },

      // Haver you ever had endometrial cancer, ovarian cancer, or cervical cancer?
      q40b:{
        options: [
          { name : 'Yes', value : 1  },
          { name : 'No', value : 2  },
          //{ name : "I don't know",                         value : 999  },
          //{ name : "I don't want to answer this question", value : 777  },
        ],
        selectedOption : { },
        resetInputs: function(){
          this.selectedOption = {};
        },
        ranking: function(){
          Survey.answer('q40b', {value:this.answer});
        },
        nextQuestion: function(){
          this.resetInputs();
          return 'q41';
        }
      },

      // Has a doctor, nurse, or other health professional EVER told you that you had a
      // molar pregnancy?
      q41:{
        options: [
          { name : 'Yes', value : 1  },
          { name : 'No', value : 2  },
          //{ name : "I don't know",                         value : 999  },
          //{ name : "I don't want to answer this question", value : 777  },
        ],
        selectedOption : { },
        resetInputs: function(){
          this.selectedOption = {};
        },
        ranking: function(){
          Survey.answer('q41', {value:this.answer});
        },
        nextQuestion: function(){
          this.resetInputs();
          return 'q42';
        }
      },

      // In the past 3 monthos has a doctor, nurse, or other health professional told you that you
      // had pelvid inflammatory disease (PID)?
      q42:{
        options: [
          { name : 'Yes', value : 1  },
          { name : 'No', value : 2  },
          //{ name : "I don't know",                         value : 999  },
          //{ name : "I don't want to answer this question", value : 777  },
        ],
        selectedOption : { },
        resetInputs: function(){
          this.selectedOption = {};
        },
        ranking: function(){
          Survey.answer('q42', {value:this.answer});
        },
        nextQuestion: function(){
          this.resetInputs();
          return 'q43';
        }
      },

      // Has a doctor, nurse, or other health professional EVER told you that you had
      // toxic shock syndrome (tss)?
      q43:{
        options: [
          { name : 'Yes', value : 1  },
          { name : 'No', value : 2  },
          //{ name : "I don't know",                         value : 999  },
          //{ name : "I don't want to answer this question", value : 777  },
        ],
        selectedOption : { },
        resetInputs: function(){
          this.selectedOption = {};
        },
        ranking: function(){
          Survey.answer('q43', {value:this.answer});
        },
        nextQuestion: function(){
          this.resetInputs();
          return 'q44';
        }
      },

      // Has a doctor, nurse, or other health professional EVER told you that you had pelvic tuberculosis?
      q44:{
        options: [
          { name : 'Yes', value : 1  },
          { name : 'No', value : 2  },
          //{ name : "I don't know",                         value : 999  },
          //{ name : "I don't want to answer this question", value : 777  },
        ],
        selectedOption : { },
        resetInputs: function(){
          this.selectedOption = {};
        },
        ranking: function(){
          Survey.answer('q44', {value:this.answer});
        },
        nextQuestion: function(){
          this.resetInputs();
          return 'q45';
        }
      },

      // Has a doctor, nurse, or other health professional EVER told you that you had
      // endometriosis?
      q45:{
        options: [
          { name : 'Yes', value : 1  },
          { name : 'No', value : 2  },
          //{ name : "I don't know",                         value : 999  },
          //{ name : "I don't want to answer this question", value : 777  },
        ],
        selectedOption : { },
        resetInputs: function(){
          this.selectedOption = {};
        },
        ranking: function(){
          Survey.answer('q45', {value:this.answer});
        },
        nextQuestion: function(){
          this.resetInputs();
          return 'q46';
        }
      },

      // Has a doctor, nurse, or other health professional EVER told you that you had diabetes?
      q46:{
        options: [
          { name : 'Yes', value : 1  },
          { name : 'No', value : 2  },
          //{ name : "I don't know",                         value : 999  },
          //{ name : "I don't want to answer this question", value : 777  },
        ],
        selectedOption : { },
        resetInputs: function(){
          this.selectedOption = {};
        },
        ranking: function(){

          return;
        },
        nextQuestion: function(){
          this.resetInputs();
          if (this.answer == 1) { return 'q46a'; }
          else { return 'q47'; }
        }
      },

      // Have you had diabetes for more than 20 years?
      q46a:{
        options: [
          { name : 'Yes', value : 1  },
          { name : 'No', value : 2  },
          //{ name : "I don't know",                         value : 999  },
          //{ name : "I don't want to answer this question", value : 777  },
        ],
        selectedOption : { },
        resetInputs: function(){
          this.selectedOption = {};
        },
        ranking: function(){
          Survey.answer('q46a', {value:this.answer});
        },
        nextQuestion: function(){
          this.resetInputs();
          return 'q46b';
        }
      },

      // Do you have problems with your kidneys, eyes or nerves because of diabetes?
      q46b:{
        options: [
          { name : 'Yes', value : 1  },
          { name : 'No', value : 2  },
          //{ name : "I don't know",                         value : 999  },
          //{ name : "I don't want to answer this question", value : 777  },
        ],
        selectedOption : { },
        resetInputs: function(){
          this.selectedOption = {};
        },
        ranking: function(){
          Survey.answer('q46b', {value:this.answer});
        },
        nextQuestion: function(){
          this.resetInputs();
          return 'q47';
        }
      },

      // Do you have migraine headaches?
      q47:{
        options: [
          { name : 'Yes', value : 1  },
          { name : 'No', value : 2  },
          //{ name : "I don't know",                         value : 999  },
          //{ name : "I don't want to answer this question", value : 777  },
        ],
        selectedOption : { },
        resetInputs: function(){
          this.selectedOption = {};
        },
        ranking: function(){
          return;
        },
        nextQuestion: function(){
          this.resetInputs();
          if (this.answer == 1) { return 'q47a'; }
          else { return 'q48'; }
        }
      },


      // Do you have migraine headaches with an aura? An aoura is seeing spots or wavy lines
      // before or during the migraine headache
      q47a:{
        options: [
          { name : 'Yes', value : 1  },
          { name : 'No', value : 2  },
          //{ name : "I don't know",                         value : 999  },
          //{ name : "I don't want to answer this question", value : 777  },
        ],
        selectedOption : { },
        resetInputs: function(){
          this.selectedOption = {};
        },
        ranking: function(){
          Survey.answer('q47a', {value:this.answer});
        },
        nextQuestion: function(){
          this.resetInputs();
          return 'q48';
        }
      },

      // Has a doctor, nurse, or other health professional EVER told you that you had AIDS?
      q48:{
        options: [
          { name : 'Yes', value : 1  },
          { name : 'No', value : 2  },
          //{ name : "I don't know",                         value : 999  },
          //{ name : "I don't want to answer this question", value : 777  },
        ],
        selectedOption : { },
        resetInputs: function(){
          this.selectedOption = {};
        },
        ranking: function(){
          Survey.answer('q48', {value:this.answer});
        },
        nextQuestion: function(){
          this.resetInputs();
          return 'q48a';
        }
      },

      // Has a doctor, nurse, or other health professional EVER told you that you had liver
      // or gallbladder problems?
      q48a:{
        options: [
          { name : 'Yes', value : 1  },
          { name : 'No', value : 2  },
          //{ name : "I don't know",                         value : 999  },
          //{ name : "I don't want to answer this question", value : 777  },
        ],
        selectedOption : { },
        resetInputs: function(){
          this.selectedOption = {};
        },
        ranking: function(){
          return;
        },
        nextQuestion: function(){
          this.resetInputs();
          if (this.answer == 1) { return 'q48b'; }
          else { return 'q48b'; }
        }
      },


      // Has a doctor, nurse, or other health professional EVER told you that you had
      // liver or gallbladder disease or gallstones?
      q48b:{
        options: [
          { name : 'Yes', value : 1  },
          { name : 'No', value : 2  },
          //{ name : "I don't know",                         value : 999  },
          //{ name : "I don't want to answer this question", value : 777  },
        ],
        selectedOption : { },
        resetInputs: function(){
          this.selectedOption = {};
        },
        ranking: function(){
          Survey.answer('q48b', {value:this.answer});
        },
        nextQuestion: function(){
          this.resetInputs();
          return 'q49';
        }
      },

      // Has a doctor, nurse, or other health professional EVER told you that you had cirrhosis
      // or active hepatitis?
      q49:{
        options: [
          { name : 'Yes', value : 1  },
          { name : 'No', value : 2  },
          //{ name : "I don't know",                         value : 999  },
          //{ name : "I don't want to answer this question", value : 777  },
        ],
        selectedOption : { },
        resetInputs: function(){
          this.selectedOption = {};
        },
        ranking: function(){
          Survey.answer('q49', {value:this.answer});
        },
        nextQuestion: function(){
          this.resetInputs();
          return 'q50';
        }
      },

      // Has a doctor, nurse, or other health professional EVER told you that you had a
      // seizure disorder or epilepsy?
      q50:{
        options: [
          { name : 'Yes', value : 1  },
          { name : 'No', value : 2  },
          //{ name : "I don't know",                         value : 999  },
          //{ name : "I don't want to answer this question", value : 777  },
        ],
        selectedOption : { },
        resetInputs: function(){
          this.selectedOption = {};
        },
        ranking: function(){
          Survey.answer('q50', {value:this.answer});
        },
        nextQuestion: function(){
          this.resetInputs();
          return 'q51';
        }
      },

      // ADDING THIS QUESTION BACK IN
      // Do you have severe acne?
      q51:{
        options: [
          { name : 'Yes', value : 1  },
          { name : 'No', value : 2  },
          //{ name : "I don't know",                         value : 999  },
          //{ name : "I don't want to answer this question", value : 777  },
        ],
        selectedOption : { },
        resetInputs: function(){
          this.selectedOption = {};
        },
        ranking: function(){
          Survey.answer('q51', {value:this.answer});
        },
        nextQuestion: function(){
          this.resetInputs();
          return 'q52';
        }
      },


      // Do you have coarse, dark hairs on your face?
      q52:{
        options: [
          { name : 'Yes', value : 1  },
          { name : 'No', value : 2  },
          //{ name : "I don't know",                         value : 999  },
          //{ name : "I don't want to answer this question", value : 777  },
        ],
        selectedOption : { },
        resetInputs: function(){
          this.selectedOption = {};
        },
        ranking: function(){
          Survey.answer('q52', {value:this.answer});
        },
        nextQuestion: function(){
          this.resetInputs();
          return 'q53';
        }
      },


// *******************************************************
//
// This begins the first question of the new section
//
// *******************************************************

      // Do you take dietary supplements or prescription medications regularly?
      q53:{
        options: [
          { name : 'Yes', value : 1  },
          { name : 'No', value : 2  },
          //{ name : "I don't know",                         value : 999  },
          //{ name : "I don't want to answer this question", value : 777  },
        ],
        selectedOption : { },
        resetInputs: function(){
          this.selectedOption = {};
        },
        ranking: function(){
          return;
        },
        nextQuestion: function(){
          this.resetInputs();
          if (this.answer == 1) { return 'q53a'; }
          else { return 'q53h'; }
        }
      },

      // Do you take St. John's wort?
      q53a:{
        options: [
          { name : 'Yes', value : 1  },
          { name : 'No', value : 2  },
          //{ name : "I don't know",                         value : 999  },
          //{ name : "I don't want to answer this question", value : 777  },
        ],
        selectedOption : { },
        resetInputs: function(){
          this.selectedOption = {};
        },
        ranking: function(){
          Survey.answer('q53a', {value:this.answer});
        },
        nextQuestion: function(){
          this.resetInputs();
          return 'q53b';
        }
      },

      // Do you take Rifampin, Rihadin or Rinactana?
      q53b:{
        options: [
          { name : 'Yes', value : 1  },
          { name : 'No', value : 2  },
          //{ name : "I don't know",                         value : 999  },
          //{ name : "I don't want to answer this question", value : 777  },
        ],
        selectedOption : { },
        resetInputs: function(){
          this.selectedOption = {};
        },
        ranking: function(){
          Survey.answer('q53b', {value:this.answer});
        },
        nextQuestion: function(){
          this.resetInputs();
          return 'q53c';
        }
      },

      // Do you take any of these seizure medications?
      q53c:{
        options: [
          { value : 1, name : 'Phenytoin or Dilantin' },
          { value : 2, name : 'Carbamazepine or Tegretol' },
          { value : 3, name : 'Primadone or Mysoline' },
          { value : 4, name : 'Topiramate or Topamax' },
          { value : 5, name : 'Oxycarbazepine or Trileptal' },
          { value : 777, name : "None" },
          //{ value : 999, name : "No" },
        ],
        selectedOptions: [ ],
        toggleCheck: function(option) {
          if (this.selectedOptions.indexOf(option) == -1) {
            this.selectedOptions.push(option);
          } else {
            this.selectedOptions.splice(this.selectedOptions.indexOf(option),1);
          }
        },
        resetInputs: function(){
          this.selectedOption = {};
        },
        nextQuestion: function(){
          this.resetInputs();
          return 'q53h';
        },
        ranking: function(){
          if(this.answer && this.answer.array){
            Survey.answer('q53c', {optionList:this.answer.array});
          }
        }
      },

      // Do you take Griseofulvin, Fulvicin or Grisactin?
      q53h:{
        options: [
          { name : 'Yes', value : 1  },
          { name : 'No', value : 2  },
          //{ name : "I don't know",                         value : 999  },
          //{ name : "I don't want to answer this question", value : 777  },
        ],
        selectedOption : { },
        resetInputs: function(){
          this.selectedOption = {};
        },
        ranking: function(){
          return;
        },
        nextQuestion: function(){
          this.resetInputs();
          return 'q54a';
        }
      },



  // *******************************************************
  //
  // This begins the first question of the new section
  //
  // *******************************************************


      // The birth control pill requires that you take a pill every single day
      // Could you remember to take a pill every single day?
      q54a:{
        options: [
          { name : 'Yes', value : 1  },
          { name : 'No', value : 2  },
          { name : "I don't know",                         value : 999  },
          //{ name : "I don't want to answer this question", value : 777  },
        ],
        selectedOption : { },
        resetInputs: function(){
          this.selectedOption = {};
        },
        ranking: function(){
          Survey.answer('q54a', {value:this.answer});
        },
        nextQuestion: function(){
          this.resetInputs();
          return 'q54b';
        }
      },

      // The birth control shot requires that you return to the clinic every three months to get a
      // shot, would you be able to do this?
      q54b:{
        options: [
          { name : 'Yes', value : 1  },
          { name : 'No', value : 2  },
          { name : "I don't know",                         value : 999  },
          //{ name : "I don't want to answer this question", value : 777  },
        ],
        selectedOption : { },
        resetInputs: function(){
          this.selectedOption = {};
        },
        ranking: function(){
          Survey.answer('q54b', {value:this.answer});
        },
        nextQuestion: function(){
          this.resetInputs();
          return 'q54c';
        }
      },

      // The contraceptive ring requires that you place a small bendable ring in your vagina
      // once per month. Would you feel comfortable using the ring as a birth control method?
      q54c:{
        options: [
          { name : 'Yes', value : 1  },
          { name : 'No', value : 2  },
          { name : "I don't know",                         value : 999  },
          //{ name : "I don't want to answer this question", value : 777  },
        ],
        selectedOption : { },
        resetInputs: function(){
          this.selectedOption = {};
        },
        ranking: function(){
          Survey.answer('q54c', {value:this.answer});
        },
        nextQuestion: function(){
          this.resetInputs();
          return 'q54d';
        }
      },

      // Would you feel comfortable having an IUD, a T-shaped contracpetive, placed by your
      // provider inside your uterus that would provide contracpetion for 5-10 years?
      q54d:{
        options: [
          { name : 'Yes', value : 1  },
          { name : 'No', value : 2  },
          { name : "I don't know",                         value : 999  },
          //{ name : "I don't want to answer this question", value : 777  },
        ],
        selectedOption : { },
        resetInputs: function(){
          this.selectedOption = {};
        },
        ranking: function(){
          Survey.answer('q54d', {value:this.answer});
        },
        nextQuestion: function(){
          this.resetInputs();
          return 'q54e';
        }
      },


      // The contraceptive implant is a small rod placed by your provider under the
      // sking of your upper arm that provides contracpetion for up to 3 years?
      q54e:{
        options: [
          { name : 'Yes', value : 1  },
          { name : 'No', value : 2  },
          { name : "I don't know",                         value : 999  },
          //{ name : "I don't want to answer this question", value : 777  },
        ],
        selectedOption : { },
        resetInputs: function(){
          this.selectedOption = {};
        },
        ranking: function(){
          Survey.answer('q54e', {value:this.answer});
        },
        nextQuestion: function(){
          this.resetInputs();
          return 'end';
        }
      }
    };

    return {
      questions: questions,
      ranking: ranking,
      initRanking: initRanking,
      sectionEnd: sectionEnd,
      problems: problems,
      survey:Survey,
      getRanking: function(){
        return ranking;
      },
      getResults: function() {
        return Survey.results();
      },

    };
});
