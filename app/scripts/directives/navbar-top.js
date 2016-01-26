'use strict';

/**
 * @ngdoc directive
 * @name digitalclassApp.directive:navbarTop
 * @description
 * # navbarTop
 */
angular.module('digitalclassApp')
  .directive('navbarTop', function () {
    return {
      restrict: 'E',
      templateUrl: 'app/templates/navbar-top.html',
      link: function postLink(scope, element, attrs) {
        // Debug
        console.log("Load navbar-top directive")
      }
    };
  });
