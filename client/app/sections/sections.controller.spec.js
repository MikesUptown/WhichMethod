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
    var a = [];
    a[0] = 123;

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
    expect(scope.ranking['implanon'].n).toEqual(-3);
  });

  it('q1: should set vas=-999 if age is 16 ...', function () {
    scope.questions.q1.answer = 16;
    scope.questions.q1.ranking();
    expect(scope.ranking['vas'].n).toEqual(-999);
  });

  it('q2: should set ortho-evra=-2 if weight is 210 ...', function () {
    scope.questions.q2.answer = 210;
    scope.questions.q2.ranking();
    expect(scope.ranking['ortho-evra'].n).toEqual(-2);
  });

  it('q2: should set depo=-2, ortho-evra=-2 if weight is 260 ...', function () {
    scope.questions.q2.answer = 260;
    scope.questions.q2.ranking();
    expect(scope.ranking['ortho-evra'].n).toEqual(-2);
    expect(scope.ranking['depo'].n).toEqual(-2);
  });
});
