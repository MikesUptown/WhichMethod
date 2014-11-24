'use strict';

describe('Controller: SectionsCtrl', function () {

  // load the controller's module
  beforeEach(module('contraceptionApp'));

  var SectionsCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    console.log('beforeEach()');
    scope = $rootScope.$new();
    SectionsCtrl = $controller('SectionsCtrl', {
      $scope: scope
    });
  }));

  it('q1: should set implanon=-3 if age is 18 ...', function () {
    var prev = scope.ranking['implanon'].n;

    var seen = [];
    console.log(
        JSON.stringify(scope, function(key, val) {
            if (val != null && typeof val == "object") {
                if (seen.indexOf(val) >= 0)
                    return
                seen.push(val)
            }
            return val
    }));
    console.log(JSON.stringify(scope.questions));


    scope.questions.q1.answer = 18;
    scope.questions.q1.ranking();
    expect(scope.ranking['implanon'].n).toEqual(prev-3);
  });

  it('q1: should set vas=-999 if age is 16 ...', function () {
    var prev = scope.ranking['vas'].n;
    scope.questions.q1.answer = 16;
    scope.questions.q1.ranking();
    expect(scope.ranking['vas'].n).toEqual(prev-999);
  });

  it('q1: should set nextQuestion = q2 ...', function () {
    var nextQ = scope.questions.q1.nextQuestion();
    expect(nextQ).toEqual('q2');
  });

  it('q2: should set ortho-evra=-2 if weight is 210 ...', function () {
    var prev = scope.ranking['ortho-evra'].n;
    scope.questions.q2.answer = 210;
    scope.questions.q2.ranking();
    expect(scope.ranking['ortho-evra'].n).toEqual(prev-2);
  });

  it('q2: should set depo=-2, ortho-evra=-2 if weight is 260 ...', function () {
    var prevOrtho = scope.ranking['ortho-evra'].n;
    var prevDepo = scope.ranking['depo'].n;
    scope.questions.q2.answer = 260;
    scope.questions.q2.ranking();
    expect(scope.ranking['ortho-evra'].n).toEqual(prevOrtho-2);
    expect(scope.ranking['depo'].n).toEqual(prevDepo-2);
  });

  it('q2: should set nextQuestion = q3 ...', function () {
    var nextQ = scope.questions.q2.nextQuestion();
    expect(nextQ).toEqual('q3');
  });

  it('q3: should set nextQuestion = q4 ...', function () {
    var nextQ = scope.questions.q3.nextQuestion();
    expect(nextQ).toEqual('q4');
  });

  it('q3: should set ocp=-999, ortho-evra=-999, nuvaring=-999 if answer is 3 and age > 30 ...', function () {
    var prevOcp = scope.ranking['ocp'].n;
    var prevOrtho = scope.ranking['ortho-evra'].n;
    var prevNuva = scope.ranking['nuvaring'].n;
    scope.questions.q3.answer = 3;
    scope.questions.q1.answer = 36;
    scope.questions.q3.ranking();
    expect(scope.ranking['ocp'].n).toEqual(prevOcp-999);
    expect(scope.ranking['ortho-evra'].n).toEqual(prevOrtho-999);
    expect(scope.ranking['nuvaring'].n).toEqual(prevNuva-999);
  });

  it('q4: should set nextQuestion = q4a if answer is 0 ...', function () {
    scope.questions.q4.answer = 0;
    var nextQ = scope.questions.q4.nextQuestion();
    expect(nextQ).toEqual('q4a');
  });
  it('q4: should set nextQuestion = q5 if answer is not 0 ...', function () {
    scope.questions.q4.answer = 1;
    var nextQ = scope.questions.q4.nextQuestion();
    expect(nextQ).toEqual('q5');
  });

  it('q4: should set ocp=-999, nuvaring=-999 fam=-3 if answer is 0 ...', function () {
    var prevOcp = scope.ranking['ocp'].n;
    var prevNuva = scope.ranking['nuvaring'].n;
    var prevFam = scope.ranking['fam'].n;
    scope.questions.q4.answer = 0;
    scope.questions.q4.ranking();
    expect(scope.ranking['ocp'].n).toEqual(prevOcp-999);
    expect(scope.ranking['nuvaring'].n).toEqual(prevNuva-999);
    expect(scope.ranking['fam'].n).toEqual(prevFam-3);
  });

  it('CHECK THIS! q4a: should set nextQuestion = q5 ...', function () {
    var nextQ = scope.questions.q4a.nextQuestion();
    expect(nextQ).toEqual('q5');
  });

  it('q4a: should set ocp+=1, pop+=1, ortho-evra+=1, nuvaring+=1, depo+=1, mirena+=1, fam-=1, implanon+=1, if answer is 0 ...', function () {
    var prevOcp = scope.ranking['ocp'].p;
    var prevNuva = scope.ranking['nuvaring'].p;
    var prevFam = scope.ranking['fam'].n;

    scope.questions.q4a.answer = 0;

    scope.questions.q4a.ranking();

    expect(scope.ranking['ocp'].p).toEqual(prevOcp + 1);
    expect(scope.ranking['nuvaring'].p).toEqual(prevNuva + 1);
    expect(scope.ranking['fam'].n).toEqual(prevFam-1);
  });



});
