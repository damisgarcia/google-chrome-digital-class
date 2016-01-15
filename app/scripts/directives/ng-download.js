'use strict';

/**
 * @ngdoc directive
 * @name digitalclassApp.directive:navbarTop
 * @description
 * # ng-download
 */
angular.module('digitalclassApp')
  .directive('ngDownload', function () {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        element[0].href = attrs.downloadLink
        element[0].download = attrs.downloadLink
      }
    };
  });
