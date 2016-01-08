'use strict';

/**
 * @ngdoc function
 * @name digitalclassApp.controller:RepositoriesCtrl
 * @description
 * # RepositoriesCtrl
 * Controller of the digitalclassApp
 */
angular.module('digitalclassApp')
  .controller('RepositoriesCtrl', function ($scope,$rootScope,$cookieStore,$sce,$state,ngDialog) {
    var self = this
    var background = chrome.runtime.connect({name:"background repositories"})

    this.profile = $cookieStore.get('profile')
    this.selection = []

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
      if(confirm("Really delete this file?"))
      background.postMessage({action:"repositories destroy", target: self.files[index].$name})
    }

    self.destroy_all = function(){
      if(confirm("Really delete this files?"))
      angular.forEach(self.selection,function(file,index){
        background.postMessage({action:"repositories destroy", target: file.$name})
      })
      self.selection = []
    }

    $scope.toggleSelection = function(repository) {
      var id = self.selection.indexOf(repository)

      if (id > -1) {
        self.selection.splice(id, 1)
        repository.checked = false
      }

      else {
        self.selection.push(repository)
        repository.checked = true
      }
    }

    $scope.selectAll = function(){
      self.selection.length == 0 ? self.selection = self.files : self.selection = []

      angular.forEach(self.files,function(file,index){
        self.selection.length == 0 ? file.checked = false : file.checked = true
      })
    }

    $scope.trustImage = function(file){
      var url = file.extensionPath + "/poster.png"
      var html = "<img src='"+url+"' width='50'/>"
      return $sce.trustAsHtml(html)
    }

    background.onMessage.addListener(function(res){
      if(res.action == "repositories list"){
        self.files = res.files
      }
      $scope.$apply()
    })

    background.postMessage({action:"repositories list"})

    // NgEvents
    $rootScope.$on('ngDialog.closed', function (e, $dialog) {
      background.postMessage({action:"repositories list"})
    })
  });
