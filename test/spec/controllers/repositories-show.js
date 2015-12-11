'use strict';

describe('Controller: RepositoriesShowCtrl', function () {

  // load the controller's module
  beforeEach(module('digitalclassApp'));

  var RepositoriesShowCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RepositoriesShowCtrl = $controller('RepositoriesShowCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(RepositoriesShowCtrl.awesomeThings.length).toBe(3);
  });
});
