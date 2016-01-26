'use strict';

describe('Controller: DesktopCtrl', function () {

  // load the controller's module
  beforeEach(module('digitalclassApp'));

  var DesktopCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DesktopCtrl = $controller('DesktopCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(DesktopCtrl.awesomeThings.length).toBe(3);
  });
});
