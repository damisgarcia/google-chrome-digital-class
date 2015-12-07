'use strict';

/**
 * @ngdoc function
 * @name digitalclassApp.controller:DesktopCtrl
 * @description
 * # DesktopCtrl
 * Controller of the digitalclassApp
 */
angular.module('digitalclassApp')
  .controller('DesktopCtrl', function ($state,$stateParams) {
    self = this
    if(!BUSY){ // if false
      var background = chrome.runtime.connect({name:"background desktop"})
      background.postMessage({action:"desktop"})
    }    
  });
