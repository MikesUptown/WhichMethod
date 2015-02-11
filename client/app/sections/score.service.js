
'use strict';

/**
 * Factory for QuestionService
 * AngularJS will instantiate this singleton
 */
angular.module('contraceptionApp').factory('scoreService', function () {



  var methodsMap={
           'Abstinence' :      'abstinence'  ,
           'Birth Control':    'ocp'  ,
           'Mini Pills':       "pop"    ,
           'Ortho Evra':       "ortho_evra",
           'Nuva Ring':        "nuvaring" ,
           'Depo Provera':     "depo"  ,
           'Male Condom':      "mcondom"  ,

           'Diaphragm':        "diaph" ,
           'Female Condom':    "fcondom"   ,
           'Sponge':           "sponge"  ,
           'Fam' :             "fam",
           'EC' :              "ec" ,
           'Paragard':         "paragard" ,
           'Mirena':           "mirena" ,
           'Withdrawal':       "withd",
           'Spermicide':       "sperm" ,
           'Tubes Tied':     "btl" ,
           'Vasectomy':      "vas" ,
           'Implant':        "implanon" ,
           'Breast Feeding':  "bf" 
  }


  var scoreParameters = {
    abstinence :null,
    ocp:        {pd: 13, nd:-20, effectiveness: .92},
    pop:        {pd: 13, nd:-16, effectiveness: .92},
    ortho_evra: {pd: 13, nd:-20, effectiveness: .92},
    nuvaring:   {pd: 13, nd:-20, effectiveness: .92},
    depo:       {pd: 17, nd:-28, effectiveness: .97},
    mcondom:    {pd: 6, nd:-21, effectiveness: .85},
    fcondom:    {pd: 6, nd:-15, effectiveness: .79},
    ccap:       {pd: 7, nd:-18, effectiveness: .68, special: .84},
    diaph:      {pd: 7, nd:-18, effectiveness: .84, special: .84},
    ec:         {pd: 7, nd:-12, effectiveness: .89},
    paragard:   {pd: 12, nd:-22, effectiveness: .992},
    mirena:     {pd: 17, nd:-32, effectiveness: .999},
    withd:      {pd: 6, nd:-15, effectiveness: .73},
    sperm:      {pd: 6, nd:-21, effectiveness: .71},
    sponge:     {pd: 7, nd:-24, effectiveness: .68, special: .84},
    fam:        {pd: 7, nd:-15, effectiveness: .9625},
    btl:        {pd: 9, nd:-6, effectiveness: .995},
    vas:        {pd: 9, nd:-6, effectiveness: .9985},
    implanon:   {pd: 15, nd:-27, effectiveness: .9995},
    bf:         {pd: 7, nd:-9, effectiveness: .98}
  }

  var score={}

  var calculateScore = function(ranking,survey){
    for(var i=0;i<ranking.length;i++){

      var bc = ranking[i].name
      if(!scoreParameters[bc])
        continue;
      // if(bc != 'ccap' && bc != 'diaph' && bc != 'sponge')
      var n = ranking[i].n
      var p = ranking[i].p
      var pd = scoreParameters[bc].pd
      var nd = scoreParameters[bc].nd
      var eff = scoreParameters[bc].effectiveness

      score[bc]= (p/pd - n/nd)*eff
    }
    convertAnwers(survey)
    calculateColors()
    return score;
  }

  var colors = {
  }
  
  var calculateColors = function(){
    
    colors = {
      green:["abstinence", "mcondom", "ec"],
      yellow:[],
      red:[]
    }


    Object.keys(score).map(function(key, index) {
      
      //these are automatically green
      if(key=='abstinence' || key=='ec' || key=='mcondom')
        return;

      var sc = score[key]
      var isEffective = (effective.indexOf(key)>-1) ? true : false
      var isInterested = (interested.indexOf(key)>-1) ? true : false
      var isUnplanned = (unplanned.indexOf(key)>-1) ? true : false

      if(sc>=.5){
        if(isUnplanned)
          colors.yellow.push(key)
        else colors.green.push(key)     
      }
      else if(sc>=.25){
        if((isInterested || isEffective) && !isUnplanned)
          colors.green.push(key) 
        else colors.yellow.push(key)
      }
      else if (sc >= 0){
        if(isInterested || isEffective)
          colors.yellow.push(key) 
      }
      else if(sc>=-90 && isEffective){
        colors.yellow.push(key)
      }
      else{
        colors.red.push(key)
      }
    });

    console.log(colors)

  }

  var interested = []
  var effective = ["ocp","pop","orthoevra","nuvaring","depo","vas","btl","implanon","paragard","mirena"]
  var unplanned = []
  function convertAnwers(survey){
    if(survey.answerList.q17 && survey.answerList.q17.optionList){
      survey.answerList.q17.optionList.forEach(function(el){
        var bcName = el.name
        var bcCode = methodsMap[bcName]
        interested.push(bcCode)
      })
    }
    if(survey.answerList.q16bi && survey.answerList.q16bi.optionList){
      survey.answerList.q16bi.optionList.forEach(function(el){
        var bcName = el.name
        var bcCode = methodsMap[bcName]
        unplanned.push(bcCode)
      })
    }
    if(survey.answerList.q19ai){
      survey.answerList.q19ai.forEach(function(el){
        var bcName = el.name
        var bcCode = methodsMap[bcName]
        if(!el.optionsList)
          return;
        el.optionList.forEach(function(problem){
          if(problem.name="I got pregnant"){
            unplanned.push(bcCode)
          }
        })
      })
    }
    // console.log(interested)
    // console.log(unplanned)

  }

  return {
    params: scoreParameters,
    calculateScore: calculateScore,
    getColors: function(){return colors}
  }

})

