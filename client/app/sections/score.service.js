
'use strict';

/**
 * Factory for QuestionService
 * AngularJS will instantiate this singleton
 */
angular.module('contraceptionApp').factory('scoreService', function () {



  var methodsMap={
           'Abstinence' :      "abstinence"  ,
           'Birth Control':    "ocp"  ,
           'Mini Pills':       "pop"    ,
           'Ortho Evra':       "ortho_evra",
           'Nuva Ring':        "nuvaring" ,
           'Depo Provera':     "depo"  ,
           'Male Condom':      "mcondom"  ,

           'Diaphragm':        "diaph" ,
           'Cervical Cap':      "ccap",
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


  var methods={
    abstinence:{
      name: 'Abstinence',
      longText: 'Abstinence',
      img:'',
      nameES : 'Abstinencia',
    },
    ocp:{
      name: 'Birth Control',
      longText: 'The pill or birth control pills (containing both an estrogen and progestin)',
      img:'OCP',
      nameES : 'Píldoras anticonceptivas',

    },
    pop:{
      name: 'Mini Pills',
      longText: "Mini-Pills or progestin-only pills",
      img: 'POP',
      nameES : 'Mini-píldoras',

    },
    ortho_evra:{
      name:'Ortho Evra',
      longText: 'Ortho Evra contraceptive patch',
      img: 'patch',
      nameES : 'Ortho Evra (Parche anticonceptivos)',
    },
    nuvaring:{
      name: "Nuva Ring",
      longText: "Nuva Ring (the vaginal ring)",
      img: 'nuvaring',
      nameES : 'NuvaRing',
    },
    depo:{
      name:"Depo Provera",
      longText: "Depo Provera",
      img:"deprovera",
      nameES : 'Depo Provera, (Inyección)',
    },
    mcondom:{
      name:"Male Condom",
      longText:"Male Condom",
      img: "",
      nameES : 'Condón masculino',
    },
    diaph:{
      name:"Diaphragm",
      longText:"Diaphragm",
      img:'diaphram',
      nameES : 'Diafragma',
    },
    ccap:{
      name:"Cervical Cap",
      longText:"Cervical Cap",
      img:'female_barrier'
    },
    fcondom:{
      name:'Female Condom',
      longText: 'Female Condom',
      img: 'female_condom',
      nameES : 'Condón femenino',
    },
    sponge:{
      name:"Sponge",
      longText:"Contraceptive Sponge",
      img:'sponge',
      nameES : 'Esponja anticonceptiva',
    },
    female_barrier:{
      name:"Female Barrier",
      longText:"Female barrier methods (Diaphragm, cervical cap, female condom, contraceptive sponge)",
      img:"female_barrier"
    },
    fam:{
      name:"Fam",
      longText:"Fertility Awareness-Based Methods",
      img: 'fam',
      nameES : 'Planificación Familiar Natural',
    },
    ec:{
      name:"EC",
      longText:"Emergency Contraception",
      img: '',
      nameES : 'Píldoras anticonceptivas de emergencia',
    },
    paragard:{
      name:"Paragard",
      longText:"Paragard Copper T IUD (Intrauterine Device)",
      img: 'paraguard',
      nameES : 'Paragard  (T de cobre DIU)',
    },
    mirena:{
      name:"Mirena",
      longText:"Mirena Hormonal IUD (Intrauterine Device)",
      img: 'mirena',
      nameES : 'Mirena (DIU hormonal)',
    },
    withd:{
      name:"Withdrawal",
      longText:"Pulling out or withdrawal",
      img: 'withdraw',
      nameES : 'Retiro del pene antes de la eyaculación',
    },
    sperm:{
      name:"Spermicide",
      longText:"Spermicide",
      img: 'spermicide',
      nameES : 'Espermicidas',
    },
    btl:{
      name:"Tubes Tied",
      longText:"Tubal ligation (sterilization for women)",
      img:'btl',
      nameES : 'Ligamiento de Tubos (Esterilización permanente para mujeres)',
    },
    vas:{
      name:"Vasectomy",
      longText:"Vasectomy (sterilization for men)",
      img:'vasect',
      nameES : 'Vasectomía (Esterilización permanente para hombres)',
    },
    implanon:{
      name:"Implant",
      longText:"Contraceptive implant, sometimes called Norplant or Implanon",
      img:'implanon',
      nameES : 'Implante anticonceptivo (Norplant o Implanon)',

    },
    bf:{
      name:"Breast Feeding",
      longText:"Breast Feeding",
      img:'breastfeed',
      nameES : 'Lactancia',
    }
  }

  // var methodsMapLookup={}
  // Object.keys(methodsMap).forEach(function(key) {
  //   methodsMapLookup[methodsMap[key]]=key
  // }); 


  var scoreParameters = {
    abstinence :null,
    ocp:        {pd: 13, nd:-20, effectiveness: .92},
    pop:        {pd: 13, nd:-16, effectiveness: .92},
    ortho_evra: {pd: 13, nd:-20, effectiveness: .92},
    nuvaring:   {pd: 12, nd:-20, effectiveness: .92},
    depo:       {pd: 16, nd:-28, effectiveness: .97},
    mcondom:    {pd: 6, nd:-21, effectiveness: .85},
    fcondom:    {pd: 7, nd:-15, effectiveness: .79},
    ccap:       {pd: 7, nd:-18, effectiveness: .68, special: .84},
    diaph:      {pd: 7, nd:-18, effectiveness: .84, special: .84},
    ec:         {pd: 7, nd:-12, effectiveness: .89},
    paragard:   {pd: 11, nd:-22, effectiveness: .992},
    mirena:     {pd: 12, nd:-32, effectiveness: .999},
    withd:      {pd: 6, nd:-15, effectiveness: .73},
    sperm:      {pd: 6, nd:-21, effectiveness: .71},
    sponge:     {pd: 7, nd:-24, effectiveness: .68, special: .84},
    fam:        {pd: 7, nd:-15, effectiveness: .9625},
    btl:        {pd: 7, nd:-6, effectiveness: .995},
    vas:        {pd: 7, nd:-6, effectiveness: .9985},
    implanon:   {pd: 14, nd:-27, effectiveness: .9995},
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

      if(n<=-99)
        score[bc] = -99
      else
        score[bc]= (p/pd - n/nd)*eff
    }
    convertAnwers(survey)
    calculateColors()
    return score;
  }

  var colors = {
  }
  
  var calculateColors = function(){

    // var abstinence = {
    //   key: 'abstinence',
    //   name: methodsMapLookup['abstinence']
    // }
    // var mcondom ={
    //   key: 'mcondom',
    //   name: methodsMapLookup['mcondom']
    // }
    // var ec = {
    //   key: 'ec',
    //   name: methodsMapLookup['ec']
    // }
    
    colors = {
      // green:[abstinence, mcondom, ec],
      green:[],
      yellow:[],
      red:[]
    }

    //test
    // Object.keys(methods).forEach(function(key){
    //   colors.red.push(methods[key])
    // })

    Object.keys(score).map(function(key, index) {
      
      //these are automatically green
      if(key=='abstinence' || key=='ec' || key=='mcondom')
        return;

      var sc = score[key]
      var isEffective = (effective.indexOf(key)>-1) ? true : false
      var isInterested = (interested.indexOf(key)>-1) ? true : false
      var isUnplanned = (unplanned.indexOf(key)>-1) ? true : false

      var bcMethod = methods[key]
      if(!bcMethod) return;

      if(sc>=.5){
        if(isUnplanned)
          colors.yellow.push(bcMethod)
        else colors.green.push(bcMethod)     
      }
      else if(sc>=.25){
        if((isInterested || isEffective) && !isUnplanned)
          colors.green.push(bcMethod) 
        else colors.yellow.push(bcMethod)
      }
      else if (sc >= 0){
        if(isInterested || isEffective)
          colors.yellow.push(bcMethod) 
      }
      else if(sc>=-90 && isEffective){
        colors.yellow.push(bcMethod)
      }
      else{
        colors.red.push(bcMethod)
      }
    });

    console.log(colors)

  }

  var interested = []
  var effective = ["ocp","pop","ortho_evra","nuvaring","depo","vas","btl","implanon","paragard","mirena"]
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
