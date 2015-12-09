'use strict';

describe('Controller: DesktopWithCameraCtrl', function () {

  // load the controller's module
  beforeEach(module('digitalclassApp'));

  var DesktopWithCameraCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DesktopWithCameraCtrl = $controller('DesktopWithCameraCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(DesktopWithCameraCtrl.awesomeThings.length).toBe(3);
  });
});
