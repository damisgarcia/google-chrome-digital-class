'use strict';

/**
 * @ngdoc function
 * @name digitalclassApp.controller:RepositoriesCtrl
 * @description
 * # RepositoriesCtrl
 * Controller of the digitalclassApp
 */
angular.module('digitalclassApp')
  .controller('RepositoriesCtrl', function ($scope) {
    var self = this
    var background = chrome.runtime.connect({name:"background repositories"})

    background.onMessage.addListener(function(res){
      if(res.action == "repositories list"){
        self.files = res.files
      }
      $scope.$apply()
    })

    self.open = function(index){
      window.open(self.files[index].extensionPath)
    }

    self.destroy = function(index){
      if(confirm("Really delete this file"))
      background.postMessage({action:"repositories destroy", filename: self.files[index].$name})
    }

    background.postMessage({action:"repositories list"})
  });
