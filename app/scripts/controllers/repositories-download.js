'use strict';

/**
 * @ngdoc function
 * @name digitalclassApp.controller:RepositoriesUploadCtrl
 * @description
 * # RepositoriesUploadCtrl
 * Controller of the digitalclassApp
 */
angular.module('digitalclassApp')
  .controller('RepositoriesDownloadCtrl', function ($scope) {
    $scope.repositories = $scope.$parent.repositories
  });
