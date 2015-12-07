'use strict';

describe('Service: getUserMedia', function () {

  // load the service's module
  beforeEach(module('digitalclassApp'));

  // instantiate service
  var getUserMedia;
  beforeEach(inject(function (_getUserMedia_) {
    getUserMedia = _getUserMedia_;
  }));

  it('should do something', function () {
    expect(!!getUserMedia).toBe(true);
  });

});
