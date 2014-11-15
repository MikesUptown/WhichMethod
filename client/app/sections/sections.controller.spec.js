'use strict';

describe('Controller: SectionsCtrl', function () {

  // load the controller's module
  beforeEach(module('contraceptionApp'));

  var SectionsCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SectionsCtrl = $controller('SectionsCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    var a = [];
    a[0] = 123;
    console.log(SectionsCtrl);
    console.log(JSON.stringify(scope.questions));
    expect(1).toEqual(1);
  });
});
