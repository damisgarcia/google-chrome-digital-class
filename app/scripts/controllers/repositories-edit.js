'use strict';

/**
 * @ngdoc function
 * @name digitalclassApp.controller:RepositoriesUploadCtrl
 * @description
 * # RepositoriesUploadCtrl
 * Controller of the digitalclassApp
 */
angular.module('digitalclassApp')
  .controller('RepositoriesEditCtrl', function ($scope,$cookieStore,$timeout) {
    var background = chrome.runtime.connect({name:"background repositories edit"})
    var self = this

    background.onMessage.addListener(function(res){            
    })
  });
