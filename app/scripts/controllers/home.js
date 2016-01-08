'use strict';

/**
 * @ngdoc function
 * @name digitalclassApp.controller:DesktopCtrl
 * @description
 * # DesktopCtrl
 * Controller of the digitalclassApp
 */
angular.module('digitalclassApp')
  .controller('HomeCtrl', function ($state) {
    var background = chrome.runtime.connect({name:"home background"})
    this.profile = Profile
    this.authorized = "data" in this.profile
  });
