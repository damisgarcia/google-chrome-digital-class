'use strict';

describe('Controller: RepositoriesUploadCtrl', function () {

  // load the controller's module
  beforeEach(module('digitalclassApp'));

  var RepositoriesUploadCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RepositoriesUploadCtrl = $controller('RepositoriesUploadCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(RepositoriesUploadCtrl.awesomeThings.length).toBe(3);
  });
});
