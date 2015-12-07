'use strict';

describe('Controller: InitializerCtrl', function () {

  // load the controller's module
  beforeEach(module('digitalclassApp'));

  var InitializerCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    InitializerCtrl = $controller('InitializerCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(InitializerCtrl.awesomeThings.length).toBe(3);
  });
});
