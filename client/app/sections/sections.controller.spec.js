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

  it('should set implanon=-3 if age is 18 ...', function () {
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
});
