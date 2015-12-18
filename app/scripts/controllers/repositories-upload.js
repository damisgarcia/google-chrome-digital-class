'use strict';

/**
 * @ngdoc function
 * @name digitalclassApp.controller:RepositoriesUploadCtrl
 * @description
 * # RepositoriesUploadCtrl
 * Controller of the digitalclassApp
 */
angular.module('digitalclassApp')
  .controller('RepositoriesUploadCtrl', function ($scope) {
    console.log($scope)
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
