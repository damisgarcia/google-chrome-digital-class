'use strict';

describe('Service: canvasEncoder', function () {

  // load the service's module
  beforeEach(module('digitalclassApp'));

  // instantiate service
  var canvasEncoder;
  beforeEach(inject(function (_canvasEncoder_) {
    canvasEncoder = _canvasEncoder_;
  }));

  it('should do something', function () {
    expect(!!canvasEncoder).toBe(true);
  });

});
