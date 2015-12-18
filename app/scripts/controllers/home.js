'use strict';

/**
 * @ngdoc function
 * @name digitalclassApp.controller:DesktopCtrl
 * @description
 * # DesktopCtrl
 * Controller of the digitalclassApp
 */
angular.module('digitalclassApp')
  .controller('HomeCtrl', function ($state,$cookieStore) {
    var background = chrome.runtime.connect({name:"home background"})
    this.profile = $cookieStore.get('profile')
  });
