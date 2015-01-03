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
      'q3','q13','q22','q27','q52','q53h', 'q58e'
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
      problemsPerBc : [],
    }

    var BirthControl = function (name) {
      this.name = name;
      this.n = 0;
      this.p = 0;
      this.decr = function(num) {
        console.log(this.name + " -> decr:" + num);
        this.n -= num;
      };
      this.incr = function(num) {
        console.log(this.name + " -> incr:" + num);
        this.p += num;
      };
      this.score = function() {
        return this.p + this.n;
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
            'orthoEvra' : new BirthControl('orthoEvra'),
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
            var result = { 'name': key, 'score': score };
            console.log(result);
            results.push(result);
          }
        }
        results.sort(function(a,b) { return parseFloat(b.score) - parseFloat(a.score); });
        for (var i = 0; i < results.length; i++) {
            console.log(results[i].name + " -> " + results[i].score);
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
      bcDecr: function(bcName, num) {
        this.bcList[bcName].decr(num);
      },
      bcIncr: function(bcName, num) {
        this.bcList[bcName].incr(num);
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
          Survey.bcDecr('vas', 999);
          Survey.bcDecr('btl', 999);
        } else {
          if (age < 21) {
            Survey.bcDecr('vas', 3);
            Survey.bcDecr('btl', 3);
          }
        }
      }
    };
    console.log("calling Survey.newQuestion");
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
          Survey.bcDecr('orthoEvra', 2);
        }
        if(weight >=250 && weight < 555){
          Survey.bcDecr('depo', 2);
        }
      }
    };
    console.log("calling Survey.newQuestion");
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
            Survey.bcDecr('ocp', 999);
            Survey.bcDecr('orthoEvra', 999);
            Survey.bcDecr('nuvaring', 999);
          }
        }
      }
    };
    console.log("calling Survey.newQuestion");
    Survey.newQuestion(q3score);

    // Scoring for 'q4'
    var q4score = new Question('q4');
    q4score.score = function(args) {
      console.log("q4.score");
      var argTypes = Question.prototype.scoreArgs.call(this, args);
      if (argTypes.hasValue) {
        var regPeriod = args.value;
        console.log("q4 has value", args.value);
        if (regPeriod == 0) {
            Survey.bcIncr('ocp', 1);
            Survey.bcIncr('nuvaring', 1);
            Survey.bcIncr('orthoEvra', 1);
            Survey.bcDecr('fam', 3);
        }
      }
    };
    console.log("calling Survey.newQuestion");
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
            Survey.bcIncr('ocp', 1);
            Survey.bcIncr('pop', 1);
            Survey.bcIncr('orthoEvra', 1);
            Survey.bcIncr('nuvaring', 1);
            Survey.bcIncr('depo', 1);
            Survey.bcIncr('mirena', 1);
            Survey.bcDecr('fam', 3);
            Survey.bcIncr('implanon', 1);
        }
      }
    };
    console.log("calling Survey.newQuestion");
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
            Survey.bcIncr('ocp', 1);
            Survey.bcIncr('pop', 1);
            Survey.bcIncr('orthoEvra', 1);
            Survey.bcIncr('nuvaring', 1);
            Survey.bcIncr('depo', 1);
            Survey.bcIncr('mirena', 1);
            Survey.bcIncr('implanon', 1);
            Survey.bcDecr('paragard', 2);
        }
      }
    };
    console.log("calling Survey.newQuestion");
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
            Survey.bcIncr('ocp', 1);
            Survey.bcIncr('pop', 1);
            Survey.bcIncr('orthoEvra', 1);
            Survey.bcIncr('nuvaring', 1);
            Survey.bcIncr('depo', 1);
            Survey.bcIncr('mirena', 1);
            Survey.bcIncr('implanon', 1);
        }
      }
    };
    console.log("calling Survey.newQuestion");
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
            Survey.bcIncr('ocp', 1);
            Survey.bcIncr('pop', 1);
            Survey.bcIncr('orthoEvra', 1);
            Survey.bcIncr('nuvaring', 1);
            Survey.bcIncr('depo', 1);
            Survey.bcDecr('paragard', 2);
            Survey.bcIncr('mirena', 1);
            Survey.bcIncr('implanon', 1);
        }
      }
    };
    console.log("calling Survey.newQuestion");
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
            Survey.bcIncr('pop', 1);
            Survey.bcDecr('orthoEvra', 3);
            Survey.bcIncr('nuvaring', 1);
            Survey.bcIncr('depo', 1);
            Survey.bcIncr('mirena', 1);
            Survey.bcIncr('implanon', 1);
        }
      }
    };
    console.log("calling Survey.newQuestion");
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
            Survey.bcIncr('ocp', 1);
            Survey.bcIncr('pop', 1);
            Survey.bcIncr('orthoEvra', 1);
            Survey.bcIncr('nuvaring', 1);
            Survey.bcIncr('depo', 1);
            Survey.bcIncr('mirena', 1);
            Survey.bcIncr('implanon', 1);
        }
      }
    };
    console.log("calling Survey.newQuestion");
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
            Survey.bcIncr('ocp', 1);
            Survey.bcIncr('pop', 1);
            Survey.bcIncr('orthoEvra', 1);
            Survey.bcIncr('nuvaring', 1);
            Survey.bcIncr('depo', 1);
            Survey.bcIncr('mirena', 1);
            Survey.bcIncr('implanon', 1);
        }
      }
    };
    console.log("calling Survey.newQuestion");
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
            Survey.bcIncr('pop', 1);
            Survey.bcIncr('depo', 1);
            Survey.bcIncr('mirena', 1);
            Survey.bcIncr('implanon', 1);
        }
      }
    };
    console.log("calling Survey.newQuestion");
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
            Survey.bcIncr('ocp', 1);
            Survey.bcIncr('pop', 1);
            Survey.bcIncr('orthoEvra', 1);
            Survey.bcIncr('nuvaring', 1);
            Survey.bcIncr('depo', 1);
            Survey.bcIncr('mirena', 1);
            Survey.bcIncr('implanon', 1);
        }
      }
    };
    console.log("calling Survey.newQuestion");
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
            Survey.bcIncr('ocp', 1);
            Survey.bcIncr('pop', 1);
            Survey.bcIncr('orthoEvra', 1);
            Survey.bcIncr('nuvaring', 1);
            Survey.bcIncr('depo', 1);
            Survey.bcIncr('mirena', 1);
            Survey.bcIncr('implanon', 1);
        }
        if (missSchoolWork == 2) {
            Survey.bcIncr('ocp', 1);
            Survey.bcIncr('pop', 1);
            Survey.bcIncr('orthoEvra', 1);
            Survey.bcIncr('nuvaring', 1);
            Survey.bcIncr('depo', 1);
            Survey.bcIncr('mirena', 1);
            Survey.bcIncr('implanon', 1);
        }
      }
    };
    console.log("calling Survey.newQuestion");
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
            Survey.bcDecr('paragard', 1);
            Survey.bcDecr('mirena', 1);
        }
      }
    };
    console.log("calling Survey.newQuestion");
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
            Survey.bcDecr('paragard', 999);
            Survey.bcDecr('mirena', 999);
        }
      }
    };
    console.log("calling Survey.newQuestion");
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
              Survey.bcDecr('ocp', 3);
              Survey.bcDecr('pop', 2);
              break;
            // Mini Pills
            case 2:
              Survey.bcDecr('ocp', 2);
              Survey.bcDecr('pop', 3);
              break;
            // Ortho Evra
            case 3:
              Survey.bcDecr('orthoEvra', 3);
              break;
            // Nuva Ring
            case 4:
              Survey.bcDecr('nuvaring', 3);
              break;
            // Depo
            case 5:
              Survey.bcDecr('depo', 3);
              break;
            // Male Condom
            case 6:
              Survey.bcDecr('mcondom', 3);
              break;
            // Diaphram, Female Condom, Sponge
            case 7:
            case 8:
            case 9:
              Survey.bcDecr('diaph', 3);
              Survey.bcDecr('fcondom', 3);
              Survey.bcDecr('ccap', 3);
              Survey.bcDecr('sponge', 3);
              break;
            // Fam
            case 10:
              Survey.bcDecr('fam', 3);
              break;
            // EC / PlanB
            case 11:
              Survey.bcDecr('ec', 3);
              break;
            // IUD / Paragard, Mirena
            case 12:
            case 13:
              Survey.bcDecr('paragard', 3);
              Survey.bcDecr('mirena', 3);
              break;
            // Withdrawal
            case 14:
              Survey.bcDecr('withd', 3);
              break;
            // Spermicide
            case 15:
              Survey.bcDecr('sperm', 3);
              break;
            // BTL / Tubes Tied
            case 16:
              Survey.bcDecr('btl', 3);
              break;
            // Vasectomy
            case 17:
              Survey.bcDecr('vas', 3);
              break;
            // Implant
            case 18:
              Survey.bcDecr('implanon', 3);
              break;
            // Breast Feeding
            case 19:
              Survey.bcDecr('bf', 3);
              break;
          }
        }
      }
    };
    console.log("calling Survey.newQuestion");
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
              Survey.bcIncr('abstinence', 1);
              break;
            // Birth Control
            case 2:
              Survey.bcIncr('ocp', 1);
              Survey.bcIncr('pop', 1);
              break;
            // Mini Pills
            case 3:
              Survey.bcIncr('ocp', 1);
              Survey.bcIncr('pop', 1);
              break;
            // Ortho Evra
            case 4:
              Survey.bcIncr('orthoEvra', 1);
              break;
            // Nuva Ring
            case 5:
              Survey.bcIncr('nuvaring', 1);
              break;
            // Depo
            case 6:
              Survey.bcIncr('depo', 1);
              break;
            // Male Condom
            case 7:
              Survey.bcIncr('mcondom', 1);
              break;
            // Diaphram
            case 8:
              Survey.bcIncr('diaph', 1);
              break;
            // Female Condom
            case 9:
              Survey.bcIncr('fcondom', 1);
              break;
            // Sponge
            case 10:
              Survey.bcIncr('sponge', 1);
              break;
            // Fam
            case 11:
              Survey.bcIncr('fam', 1);
              break;
            // EC / PlanB
            case 12:
              Survey.bcIncr('ec', 1);
              break;
            // Paragard
            case 13:
              Survey.bcIncr('paragard', 1);
              break;
            // Mirena
            case 14:
              Survey.bcIncr('mirena', 1);
              break;
            // Withdrawal
            case 15:
              Survey.bcIncr('withd', 1);
              break;
            // Spermicide
            case 16:
              Survey.bcIncr('sperm', 1);
              break;
            // BTL / Tubes Tied
            case 17:
              Survey.bcIncr('btl', 1);
              break;
            // Vasectomy
            case 18:
              Survey.bcIncr('vas', 1);
              break;
            // Implant
            case 19:
              Survey.bcIncr('implanon', 1);
              break;
            // Breast Feeding
            case 20:
              Survey.bcIncr('bf', 1);
              break;
          }
        }
      }
    };
    console.log("calling Survey.newQuestion");
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
              Survey.bcIncr('abstinence', 1);
              break;
            // Birth Control
            case 2:
              Survey.bcIncr('ocp', 1);
              break;
            // Mini Pills
            case 3:
              Survey.bcIncr('pop', 1);
              break;
            // Ortho Evra
            case 4:
              Survey.bcIncr('orthoEvra', 1);
              break;
            // Nuva Ring
            case 5:
              Survey.bcIncr('nuvaring', 1);
              break;
            // Depo
            case 6:
              Survey.bcIncr('depo', 1);
              break;
            // Male Condom
            case 7:
              Survey.bcIncr('mcondom', 1);
              break;
            // Diaphram
            case 8:
              Survey.bcIncr('diaph', 1);
              break;
            // Female Condom
            case 9:
              Survey.bcIncr('fcondom', 1);
              break;
            // Sponge
            case 10:
              Survey.bcIncr('sponge', 1);
              break;
            // Fam
            case 11:
              Survey.bcIncr('fam', 1);
              break;
            // EC / PlanB
            case 12:
              Survey.bcIncr('ec', 1);
              break;
            // Paragard
            case 13:
              Survey.bcIncr('paragard', 1);
              break;
            // Mirena
            case 14:
              Survey.bcIncr('mirena', 1);
              break;
            // Withdrawal
            case 15:
              Survey.bcIncr('withd', 1);
              break;
            // Spermicide
            case 16:
              Survey.bcIncr('sperm', 1);
              break;
            // BTL / Tubes Tied
            case 17:
              Survey.bcIncr('btl', 1);
              break;
            // Vasectomy
            case 18:
              Survey.bcIncr('vas', 1);
              break;
            // Implant
            case 19:
              Survey.bcIncr('implanon', 1);
              break;
            // Breast Feeding
            case 20:
              Survey.bcIncr('bf', 1);
              break;
          }
        }
      }
    };
    console.log("calling Survey.newQuestion");
    Survey.newQuestion(q18aiscore);

    /**
     * The questions and the behavior of each
     */
    var questions = {

      /**
       * q1:[ How old are you? ]
       */
      q1:{
        options: [
          { name : "I don't know",                         value : 999  },
          { name : "I don't want to answer this question", value : 777  },
        ],
        selectedOption : { },
        resetInputs: function(){
          this.selectedOption = {};
          this.textInput = undefined;
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
          { name : "I don't know",                         value : 999  },
          { name : "I don't want to answer this question", value : 777  },
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
          { name : "I don't know",                         value : 999  },
          { name : "I don't want to answer this question", value : 777  },
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
          { name : "I don't want to answer this question", value : 777  },
        ],
        selectedOption : { },
        resetInputs: function(){
          this.selectedOption = {};
        },
        nextQuestion: function(){
          this.resetInputs();
          if(this.answer == 2) { return 'q4a'; }
          else { return 'q7'; }
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
          { name : "I don't want to answer this question", value : 777  },
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
          { name : "I don't want to answer this question", value : 777  },
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
          { name : "I don't know",                         value : 999  },
          { name : "I don't want to answer this question", value : 777  },
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
          { name : "I don't know",                         value : 999  },
          { name : "I don't want to answer this question", value : 777  },
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
          { name : "I don't know",                         value : 999  },
          { name : "I don't want to answer this question", value : 777  },
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
          { name : "I don't want to answer this question", value : 777  },
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
          { name : "I don't know",                         value : 999  },
          { name : "I don't want to answer this question", value : 777  },
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
          { name : "I don't know",                         value : 999  },
          { name : "I don't want to answer this question", value : 777  },
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
          { name : "I don't know",                         value : 999  },
          { name : "I don't want to answer this question", value : 777  },
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
          { name : "I don't know",                         value : 999  },
          { name : "I don't want to answer this question", value : 777  },
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
          { name : "your partner and you only have sex with each other", value : 0  },
          { name : "your partner or you have sex with other people as well", value : 1  },
          { name : "you are not sure about your partner's sexual activity outside your relationship", value : 2  },
          { name : "you are not currently having sex", value : 3 },
          { name : "I don't know", value : 999  },
          { name : "I don't want to answer this question", value : 777  },
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
          { name : "I don't know",                         value : 999  },
          { name : "I don't want to answer this question", value : 777  },
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
          { name : "I don't want to answer this question", value : 777  },
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
          { name : "I don't know",                         value : 999  },
          { name : "I don't want to answer this question", value : 777  },
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
          { name : "I don't want to answer this question", value : 777  },
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
          { name : 'Birth Control',  value : 1  },
          { name : 'Mini Pills',     value : 2  },
          { name : 'Ortho Evra',     value : 3  },
          { name : 'Nuva Ring',      value : 4  },
          { name : 'Depo Provera',   value : 5  },
          { name : 'Male Condom',    value : 6  },
          { name : 'Diaphragm',      value : 7  },
          { name : 'Female Condom',  value : 8  },
          { name : 'Sponge',         value : 9  },
          { name : 'Fam',            value : 10 },
          { name : 'EC',             value : 11 },
          { name : 'Paragard',       value : 12 },
          { name : 'Mirena',         value : 13 },
          { name : 'Withdrawal',     value : 14 },
          { name : 'Spermicide',     value : 15 },
          { name : 'Tubes Tied',     value : 16 },
          { name : 'Vasectomy',      value : 17 },
          { name : 'Implant',        value : 18 },
          { name : 'Breast Feeding', value : 19 }
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
          return 'q17';
        },
        ranking: function(){
          // this.answer = 0;
          // var selLength = this.selectedOptions.length;
          // for (var i = 0; i < selLength; i++) {
          //   this.rank(this.selectedOptions[i].name);
          // }
          if(this.answer && this.answer.array){
            Survey.answer('q16bi', {optionList:this.answer.array});
          }
        },
      },

      /**
       * q17:[ Now I'm going to ask you about different birth control methods that you might be interested in using now. I will show you four screens that have different birth control methods. You can choose as many methods as you would like ]
       */
      q17:{
        options: [
          { name : 'Abstinence',     value : 1  },
          { name : 'Birth Control',  value : 2  },
          { name : 'Mini Pills',     value : 3  },
          { name : 'Ortho Evra',     value : 4  },
          { name : 'Nuva Ring',      value : 5  },
          { name : 'Depo Provera',   value : 6  },
          { name : 'Male Condom',    value : 7  },
          { name : 'Diaphragm',      value : 8  },
          { name : 'Female Condom',  value : 9  },
          { name : 'Sponge',         value : 10  },
          { name : 'Fam',            value : 11 },
          { name : 'EC',             value : 12 },
          { name : 'Paragard',       value : 13 },
          { name : 'Mirena',         value : 14 },
          { name : 'Withdrawal',     value : 15 },
          { name : 'Spermicide',     value : 16 },
          { name : 'Tubes Tied',     value : 17 },
          { name : 'Vasectomy',      value : 18 },
          { name : 'Implant',        value : 19 },
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
          { name : "I don't want to answer this question", value : 777  },
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
          { name : "I don't know",                         value : 999  },
          { name : "I don't want to answer this question", value : 777  },
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
          { name : 'Birth Control',  value : 2  },
          { name : 'Mini Pills',     value : 3  },
          { name : 'Ortho Evra',     value : 4  },
          { name : 'Nuva Ring',      value : 5  },
          { name : 'Depo Provera',   value : 6  },
          { name : 'Male Condom',    value : 7  },
          { name : 'Diaphragm',      value : 8  },
          { name : 'Female Condom',  value : 9  },
          { name : 'Sponge',         value : 10  },
          { name : 'Fam',            value : 11 },
          { name : 'EC',             value : 12 },
          { name : 'Paragard',       value : 13 },
          { name : 'Mirena',         value : 14 },
          { name : 'Withdrawal',     value : 15 },
          { name : 'Spermicide',     value : 16 },
          { name : 'Tubes Tied',     value : 17 },
          { name : 'Vasectomy',      value : 18 },
          { name : 'Implant',        value : 19 },
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
          { name : "I don't want to answer this question", value : 777  },
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
          { name : 'Birth Control',  value : 1  },
          { name : 'Mini Pills',     value : 2  },
          { name : 'Ortho Evra',     value : 3  },
          { name : 'Nuva Ring',      value : 4  },
          { name : 'Depo Provera',   value : 5  },
          { name : 'Male Condom',    value : 6  },
          { name : 'Diaphragm',      value : 7  },
          { name : 'Female Condom',  value : 8  },
          { name : 'Sponge',         value : 9  },
          { name : 'Fam',            value : 10 },
          { name : 'EC',             value : 11 },
          { name : 'Paragard',       value : 12 },
          { name : 'Mirena',         value : 13 },
          { name : 'Withdrawal',     value : 14 },
          { name : 'Spermicide',     value : 15 },
          { name : 'Tubes Tied',     value : 16 },
          { name : 'Vasectomy',      value : 17 },
          { name : 'Implant',        value : 18 },
          { name : 'Breast Feeding', value : 19 }
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
          problems.bcProblemList = this.selectedOptions.splice(0);
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
          { value : 1, name : "I didn't like the changes to my body" },
          { value : 2, name : "I had problems getting the birth control" },
          { value : 3, name : "I didn't use it right" },
          { value : 4, name : "I got pregnant" },
          { value : 5, name : "I developed health problems" },
          { value : 6, name : "I didn't like my periods" },
          { value : 7, name : "My partner didn't like it" },
          { value : 8, name : "None of these problems" },
          { value : 777, name : "I don't know" },
          { value : 999, name : "I don't want to answer this question" },
        ],
        curBcProbName : function() {
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
          var curBcProbName = this.curBcProbName();
          problems.problemsPerBc[curBcProbName] = this.selectedOptions.splice(0);
        },
        nextQuestion: function(){
          this.saveSelections();
          this.clearSelections();
          problems.curBcProbNum += 1;
          if (this.notDone()) { return 'q19ai'; }
          else { return 'q20'; }
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
          { value : 777, name : "I don't know" },
          { value : 999, name : "I don't want to answer this question" },
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

          return;
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
          { value : 999, name : "I don't want to answer this question" },
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
          this.answer = 0;
          return;
        }
      },


      /**
       * q22:[ Please select on this timeline how often you want to think about and take action for you birth control method? ]
       */
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
          { value : 999, name : "I don't want to answer this question" },
        ],
        selectedOption : { },
        resetInputs: function(){
          this.selectedOption = {};
        },
        nextQuestion: function(){
          this.resetInputs();
          return 'q23';
        },
        ranking: function(){

          return;
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
          { name : "I don't want to answer this question", value : 777  },
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

          return;
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
          { name : "I don't want to answer this question", value : 777  },
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

          return;
        }
      },

      // Would you be okay with no bleeding at all?
      q25:{
        options: [
          { name : 'Yes', value : 1  },
          { name : 'No', value : 2  },
          { name : "I don't know",                         value : 999  },
          { name : "I don't want to answer this question", value : 777  },
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

          return;
        }
      },

      // Do you need a birth control method which you can keep private?
      q26:{
        options: [
          { name : 'Yes', value : 1  },
          { name : 'No', value : 2  },
          { name : "I don't know",                         value : 999  },
          { name : "I don't want to answer this question", value : 777  },
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
          { name : "I don't want to answer this question", value : 777  },
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

          return;
        }
      },

      // Do you want to keep it private from your family or your friends?
      q26b:{
        options: [
          { name : 'Yes', value : 1  },
          { name : 'No', value : 2  },
          { name : "I don't know",                         value : 999  },
          { name : "I don't want to answer this question", value : 777  },
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

          return;
        }
      },


      // Would it be OK for you to use a birth control method that you have to interrupt sexual activity to use?
      q27:{
        options: [
          { name : 'Yes', value : 1  },
          { name : 'No', value : 2  },
          { name : "I don't know",                         value : 999  },
          { name : "I don't want to answer this question", value : 777  },
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

          return;
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
          { name : "I don't know",                         value : 999  },
          { name : "I don't want to answer this question", value : 777  },
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
          if (this.answer == 1) { return 'q28a'; }
          else { return 'q29'; }
        }
      },

      // Was your baby born less than 3 weeks ago?
      q28a:{
        options: [
          { name : 'Yes', value : 1  },
          { name : 'No', value : 2  },
          { name : "I don't know",                         value : 999  },
          { name : "I don't want to answer this question", value : 777  },
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
          if (this.answer == 1) { return 'q28b'; }
          else { return 'q29'; }
        }
      },

      // Are you breastfeeding a child now?
      q28b:{
        options: [
          { name : 'Yes', value : 1  },
          { name : 'No', value : 2  },
          { name : "I don't know",                         value : 999  },
          { name : "I don't want to answer this question", value : 777  },
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
          return 'q29';
        }
      },


      // Has a doctor, nurse or health professional EVER told you that you had high blood pressure,
      // also called hypertension?
      q29:{
        options: [
          { name : 'Yes', value : 1  },
          { name : 'No', value : 2  },
          { name : "I don't know",                         value : 999  },
          { name : "I don't want to answer this question", value : 777  },
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

      // Are you currently taking medicine for high blood pressure?
      q29a:{
        options: [
          { name : 'Yes', value : 1  },
          { name : 'No', value : 2  },
          { name : "I don't know",                         value : 999  },
          { name : "I don't want to answer this question", value : 777  },
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
          return 'q30';
        }
      },

      // Has a doctor, nurse, or other health professional EVER told you that you had blood clots, also called clot
      // in a vein or DVT?
      q30:{
        options: [
          { name : 'Yes', value : 1  },
          { name : 'No', value : 2  },
          { name : "I don't know",                         value : 999  },
          { name : "I don't want to answer this question", value : 777  },
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
          return 'q31';
        }
      },


      // Has a doctor, nurse, or other health professional EVER told you that you had pulmonary embolus,
      // also called a clot in the lung?
      q31:{
        options: [
          { name : 'Yes', value : 1  },
          { name : 'No', value : 2  },
          { name : "I don't know",                         value : 999  },
          { name : "I don't want to answer this question", value : 777  },
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
          return 'q32';
        }
      },

      // Have you had surgery in the past three months?
      q32:{
        options: [
          { name : 'Yes', value : 1  },
          { name : 'No', value : 2  },
          { name : "I don't know",                         value : 999  },
          { name : "I don't want to answer this question", value : 777  },
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
          if (this.answer == 1) { return 'q32a'; }
          else { return 'q33'; }
        }
      },

      // Is it hard moving around because of the surgery?
      q32a:{
        options: [
          { name : 'Yes', value : 1  },
          { name : 'No', value : 2  },
          { name : "I don't know",                         value : 999  },
          { name : "I don't want to answer this question", value : 777  },
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
          return 'q33';
        }
      },


      // Has a doctor, nurse, or other health professional EVER told you that you had diabetes?
      q33:{
        options: [
          { name : 'Yes', value : 1  },
          { name : 'No', value : 2  },
          { name : "I don't know",                         value : 999  },
          { name : "I don't want to answer this question", value : 777  },
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
          if (this.answer == 1) { return 'q33a'; }
          else { return 'q34'; }
        }
      },

      // Have you had diabetes for more than 20 years?
      q33a:{
        options: [
          { name : 'Yes', value : 1  },
          { name : 'No', value : 2  },
          { name : "I don't know",                         value : 999  },
          { name : "I don't want to answer this question", value : 777  },
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
          return 'q33b';
        }
      },


      // Do you have problems with your kidneys, eyes or nerves because of diabetes?
      q33b:{
        options: [
          { name : 'Yes', value : 1  },
          { name : 'No', value : 2  },
          { name : "I don't know",                         value : 999  },
          { name : "I don't want to answer this question", value : 777  },
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
          return 'q34';
        }
      },

      // Has a doctor, nurse, or other health professional EVER told you that you had a stroke?
      q34:{
        options: [
          { name : 'Yes', value : 1  },
          { name : 'No', value : 2  },
          { name : "I don't know",                         value : 999  },
          { name : "I don't want to answer this question", value : 777  },
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
          return 'q35';
        }
      },

      // Has a doctor, nurse, or other health professional EVER told you that you had a clotting disorder?
      q35:{
        options: [
          { name : 'Yes', value : 1  },
          { name : 'No', value : 2  },
          { name : "I don't know",                         value : 999  },
          { name : "I don't want to answer this question", value : 777  },
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
          return 'q36';
        }
      },

      // Do you have migraine headaches?
      q36:{
        options: [
          { name : 'Yes', value : 1  },
          { name : 'No', value : 2  },
          { name : "I don't know",                         value : 999  },
          { name : "I don't want to answer this question", value : 777  },
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
          if (this.answer == 1) { return 'q36a'; }
          else { return 'q37'; }
        }
      },


      // Do you have migraine headaches with an aura? An aoura is seeing spots or wavy lines
      // before or during the migraine headache
      q36a:{
        options: [
          { name : 'Yes', value : 1  },
          { name : 'No', value : 2  },
          { name : "I don't know",                         value : 999  },
          { name : "I don't want to answer this question", value : 777  },
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
          return 'q37';
        }
      },

      // Has a doctor, nurse, or other health professional EVER told you that you had a
      // molar pregnancy?
      q37:{
        options: [
          { name : 'Yes', value : 1  },
          { name : 'No', value : 2  },
          { name : "I don't know",                         value : 999  },
          { name : "I don't want to answer this question", value : 777  },
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
          return 'q38';
        }
      },

      // Has a doctor, nurse, or other health professional EVER told you that you had AIDS?
      q38:{
        options: [
          { name : 'Yes', value : 1  },
          { name : 'No', value : 2  },
          { name : "I don't know",                         value : 999  },
          { name : "I don't want to answer this question", value : 777  },
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
          return 'q39';
        }
      },

      // Has a doctor, nurse, or other health professional EVER told you that you had pelvic tuberculosis?
      q39:{
        options: [
          { name : 'Yes', value : 1  },
          { name : 'No', value : 2  },
          { name : "I don't know",                         value : 999  },
          { name : "I don't want to answer this question", value : 777  },
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
          return 'q40';
        }
      },

      // Has a doctor, nurse, or other health professional EVER told you that you had
      // toxic shock syndrome (tss)?
      q40:{
        options: [
          { name : 'Yes', value : 1  },
          { name : 'No', value : 2  },
          { name : "I don't know",                         value : 999  },
          { name : "I don't want to answer this question", value : 777  },
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
          return 'q41';
        }
      },

      // Has a doctor, nurse, or other health professional EVER told you that you had
      // high cholesterol?
      q41:{
        options: [
          { name : 'Yes', value : 1  },
          { name : 'No', value : 2  },
          { name : "I don't know",                         value : 999  },
          { name : "I don't want to answer this question", value : 777  },
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
          return 'q42';
        }
      },

      // In the past 3 monthos has a doctor, nurse, or other health professional told you that you
      // had pelvid inflammatory disease (PID)?
      q42:{
        options: [
          { name : 'Yes', value : 1  },
          { name : 'No', value : 2  },
          { name : "I don't know",                         value : 999  },
          { name : "I don't want to answer this question", value : 777  },
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
          return 'q43';
        }
      },

      // Has a doctor, nurse, or other health professional EVER told you that you had
      // endometriosis?
      q43:{
        options: [
          { name : 'Yes', value : 1  },
          { name : 'No', value : 2  },
          { name : "I don't know",                         value : 999  },
          { name : "I don't want to answer this question", value : 777  },
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
          return 'q44';
        }
      },


      // Has a doctor, nurse, or other health professional EVER told you that you had
      // cancer or a malignancy of any kind?
      q44:{
        options: [
          { name : 'Yes', value : 1  },
          { name : 'No', value : 2  },
          { name : "I don't know",                         value : 999  },
          { name : "I don't want to answer this question", value : 777  },
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
          if (this.answer == 1) { return 'q44a'; }
          else { return 'q45'; }
        }
      },


      // Have you ever had breast cancer, liver tumors or liver cancer?
      q44a:{
        options: [
          { name : 'Yes', value : 1  },
          { name : 'No', value : 2  },
          { name : "I don't know",                         value : 999  },
          { name : "I don't want to answer this question", value : 777  },
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
          return 'q44b';
        }
      },

      // Haver you ever had endometrial cancer, ovarian cancer, or cervical cancer?
      q44b:{
        options: [
          { name : 'Yes', value : 1  },
          { name : 'No', value : 2  },
          { name : "I don't know",                         value : 999  },
          { name : "I don't want to answer this question", value : 777  },
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
          return 'q45';
        }
      },


      // Has a doctor, nurse, or other health professional EVER told you that you had a heart
      // attach, also called a myocardial infarction, heart disease or vascular disease?
      q45:{
        options: [
          { name : 'Yes', value : 1  },
          { name : 'No', value : 2  },
          { name : "I don't know",                         value : 999  },
          { name : "I don't want to answer this question", value : 777  },
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
          return 'q46';
        }
      },

      // Has a doctor, nurse, or other health professional EVER told you that you had complicated
      // valvular heart disease?
      q46:{
        options: [
          { name : 'Yes', value : 1  },
          { name : 'No', value : 2  },
          { name : "I don't know",                         value : 999  },
          { name : "I don't want to answer this question", value : 777  },
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
          return 'q47';
        }
      },

      // Has a doctor, nurse, or other health professional EVER told you that you had liver
      // or gallbladder problems?
      q47:{
        options: [
          { name : 'Yes', value : 1  },
          { name : 'No', value : 2  },
          { name : "I don't know",                         value : 999  },
          { name : "I don't want to answer this question", value : 777  },
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


      // Has a doctor, nurse, or other health professional EVER told you that you had
      // liver or gallbladder disease or gallstones?
      q47a:{
        options: [
          { name : 'Yes', value : 1  },
          { name : 'No', value : 2  },
          { name : "I don't know",                         value : 999  },
          { name : "I don't want to answer this question", value : 777  },
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
          return 'q47b';
        }
      },

      // Has a doctor, nurse, or other health professional EVER told you that you had cirrhosis
      // or active hepatitis?
      q47b:{
        options: [
          { name : 'Yes', value : 1  },
          { name : 'No', value : 2  },
          { name : "I don't know",                         value : 999  },
          { name : "I don't want to answer this question", value : 777  },
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
          return 'q48';
        }
      },

      // Has a doctor, nurse, or other health professional EVER told you that you had a
      // seizure disorder or epilepsy?
      q48:{
        options: [
          { name : 'Yes', value : 1  },
          { name : 'No', value : 2  },
          { name : "I don't know",                         value : 999  },
          { name : "I don't want to answer this question", value : 777  },
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
          return 'q49';
        }
      },

      // Has a doctor, nurse, or other health professional EVER told you that you had
      // sickle cell anemia?
      q49:{
        options: [
          { name : 'Yes', value : 1  },
          { name : 'No', value : 2  },
          { name : "I don't know",                         value : 999  },
          { name : "I don't want to answer this question", value : 777  },
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
          return 'q50';
        }
      },

      // Has a doctor, nurse, or other health professional EVER told you that you
      // had anemia, sometimes called low blood or tired blood?
      q50:{
        options: [
          { name : 'Yes', value : 1  },
          { name : 'No', value : 2  },
          { name : "I don't know",                         value : 999  },
          { name : "I don't want to answer this question", value : 777  },
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
          return 'q51';
        }
        },

      // ADDING THIS QUESTION BACK IN
      // Do you have severe acne?
      q51:{
        options: [
          { name : 'Yes', value : 1  },
          { name : 'No', value : 2  },
          { name : "I don't know",                         value : 999  },
          { name : "I don't want to answer this question", value : 777  },
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
          return 'q52';
        }
      },


      // Do you have coarse, dark hairs on your face?
      q52:{
        options: [
          { name : 'Yes', value : 1  },
          { name : 'No', value : 2  },
          { name : "I don't know",                         value : 999  },
          { name : "I don't want to answer this question", value : 777  },
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
          { name : "I don't know",                         value : 999  },
          { name : "I don't want to answer this question", value : 777  },
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
          else { return 'q58a'; }
        }
      },

      // Do you take St. John's wort?
      q53a:{
        options: [
          { name : 'Yes', value : 1  },
          { name : 'No', value : 2  },
          { name : "I don't know",                         value : 999  },
          { name : "I don't want to answer this question", value : 777  },
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
          return 'q53b';
        }
      },

      // Do you take Rifampin, Rihadin or Rinactana?
      q53b:{
        options: [
          { name : 'Yes', value : 1  },
          { name : 'No', value : 2  },
          { name : "I don't know",                         value : 999  },
          { name : "I don't want to answer this question", value : 777  },
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
          { value : 777, name : "I don't know" },
          { value : 999, name : "I don't want to answer this question" },
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
          this.answer = 0;
          return;
        }
      },

      // Do you take Griseofulvin, Fulvicin or Grisactin?
      q53h:{
        options: [
          { name : 'Yes', value : 1  },
          { name : 'No', value : 2  },
          { name : "I don't know",                         value : 999  },
          { name : "I don't want to answer this question", value : 777  },
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
          return 'q58a';
        }
      },



  // *******************************************************
  //
  // This begins the first question of the new section
  //
  // *******************************************************


      // The birth control pill requires that you take a pill every single day
      // Could you remember to take a pill every single day?
      q58a:{
        options: [
          { name : 'Yes', value : 1  },
          { name : 'No', value : 2  },
          { name : "I don't know",                         value : 999  },
          { name : "I don't want to answer this question", value : 777  },
        ],
        selectedOption : { },
        resetInputs: function(){
          this.selectedOption = {};
        },
        ranking: function(){
          this.answer = this.selectedOption.value;
          return;
        },
        nextQuestion: function(){
          this.resetInputs();
          return 'q58b';
        }
      },

      // The birth control shot requires that you return to the clinic every three months to get a
      // shot, would you be able to do this?
      q58b:{
        options: [
          { name : 'Yes', value : 1  },
          { name : 'No', value : 2  },
          { name : "I don't know",                         value : 999  },
          { name : "I don't want to answer this question", value : 777  },
        ],
        selectedOption : { },
        resetInputs: function(){
          this.selectedOption = {};
        },
        ranking: function(){
          this.answer = this.selectedOption.value;
          return;
        },
        nextQuestion: function(){
          this.resetInputs();
          return 'q58c';
        }
      },

      // The contraceptive ring requires that you place a small bendable ring in your vagina
      // once per month. Would you feel comfortable using the ring as a birth control method?
      q58c:{
        options: [
          { name : 'Yes', value : 1  },
          { name : 'No', value : 2  },
          { name : "I don't know",                         value : 999  },
          { name : "I don't want to answer this question", value : 777  },
        ],
        selectedOption : { },
        resetInputs: function(){
          this.selectedOption = {};
        },
        ranking: function(){
          this.answer = this.selectedOption.value;
          return;
        },
        nextQuestion: function(){
          this.resetInputs();
          return 'q58d';
        }
      },

      // Would you feel comfortable having an IUD, a T-shaped contracpetive, placed by your
      // provider inside your uterus that would provide contracpetion for 5-10 years?
      q58d:{
        options: [
          { name : 'Yes', value : 1  },
          { name : 'No', value : 2  },
          { name : "I don't know",                         value : 999  },
          { name : "I don't want to answer this question", value : 777  },
        ],
        selectedOption : { },
        resetInputs: function(){
          this.selectedOption = {};
        },
        ranking: function(){
          this.answer = this.selectedOption.value;
          return;
        },
        nextQuestion: function(){
          this.resetInputs();
          return 'q58e';
        }
      },


      // The contraceptive implant is a small rod placed by your provider under the
      // sking of your upper arm that provides contracpetion for up to 3 years?
      q58e:{
        options: [
          { name : 'Yes', value : 1  },
          { name : 'No', value : 2  },
          { name : "I don't know",                         value : 999  },
          { name : "I don't want to answer this question", value : 777  },
        ],
        selectedOption : { },
        resetInputs: function(){
          this.selectedOption = {};
        },
        ranking: function(){
          this.answer = this.selectedOption.value;
          return;
        },
        nextQuestion: function(){
          this.resetInputs();
          return '';
        }
      }
    };

    return {
      questions: questions,
      ranking: ranking,
      initRanking: initRanking,
      sectionEnd: sectionEnd,
      problems: problems,
      getRanking: function(){
        return ranking;
      },
      getResults: function() {
        return Survey.results();
      },
    };
});
