'use strict';

/**
 * @ngdoc function
 * @name digitalclassApp.controller:RepositoriesCtrl
 * @description
 * # RepositoriesCtrl
 * Controller of the digitalclassApp
 */
angular.module('digitalclassApp')
  .controller('RepositoriesCtrl', function ($scope,$cookieStore,$state,ngDialog) {
    var self = this
    var background = chrome.runtime.connect({name:"background repositories"})

    this.profile = $cookieStore.get('profile')

    background.onMessage.addListener(function(res){
      if(res.action == "repositories list"){
        self.files = filterFileByWebm(res.files)
      }
      $scope.$apply()
    })

    self.openUpload = function(index){
      $state.go("repositories.upload")
      self.select_file = self.files[index]
      ngDialog.open({
        template: 'app/views/repositories-upload.html',
        controller:"RepositoriesUploadCtrl as repository",
        scope: $scope
      })
    }

    self.openEdit = function(index){
      $state.go("repositories.edit")
      self.select_file = self.files[index]
      ngDialog.open({
        template: 'app/views/repositories-edit.html',
        controller:"RepositoriesEditCtrl as repository",
        scope: $scope
      })
    }

    self.destroy = function(index){
      if(confirm("Really delete this file"))
      background.postMessage({action:"repositories destroy", filename: self.files[index].$name})
    }

    // Find for file in repository with .Webm extension
    function filterFileByWebm(files){
      var a = []
      angular.forEach(files, function(file,index){
        if(!file.$name.match(/\.[\w\d]+$/)){
          a.push(file)
        }
      })
      return a
    }

    background.postMessage({action:"repositories list"})
  });
