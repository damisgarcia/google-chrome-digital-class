'use strict';

/**
 * @ngdoc function
 * @name digitalclassApp.controller:RepositoriesUploadCtrl
 * @description
 * # RepositoriesUploadCtrl
 * Controller of the digitalclassApp
 */
angular.module('digitalclassApp')
  .controller('RepositoriesEditCtrl', function ($scope,ngDialog,$cookieStore,$timeout) {
    var background = chrome.runtime.connect({name:"background repositories edit"})
    var self = this

    self.pastname = angular.copy($scope.repositories.select_file.$name)
    self.validator_folder_name = /^([\w\d\-]*)$/

    self.update = function(form){
      if(form.$valid){
        background.postMessage({action:"repositories edit",past_name: self.pastname, new_name: self.filename})
      }
    }

    background.onMessage.addListener(function(res){
      ngDialog.close()
    })
  });
