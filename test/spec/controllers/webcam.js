'use strict';

describe('Controller: WebcamCtrl', function () {

  // load the controller's module
  beforeEach(module('digitalclassApp'));

  var WebcamCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    WebcamCtrl = $controller('WebcamCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(WebcamCtrl.awesomeThings.length).toBe(3);
  });
});
