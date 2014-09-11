'use strict';

describe('Controller: ServeyCtrl', function () {

  // load the controller's module
  beforeEach(module('contraceptionApp'));

  var ServeyCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ServeyCtrl = $controller('ServeyCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
