'use strict';

describe('Service: sections', function () {

  // load the service's module
  beforeEach(module('contraceptionApp'));

  // instantiate service
  var sections;
  beforeEach(inject(function (_sections_) {
    sections = _sections_;
  }));

  it('should do something', function () {
    expect(!!sections).toBe(true);
  });

});
