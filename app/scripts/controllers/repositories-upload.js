'use strict';

/**
 * @ngdoc function
 * @name digitalclassApp.controller:RepositoriesUploadCtrl
 * @description
 * # RepositoriesUploadCtrl
 * Controller of the digitalclassApp
 */
angular.module('digitalclassApp')
  .controller('RepositoriesUploadCtrl', function ($scope,$timeout,Profile) {
    var background = chrome.runtime.connect({name:"background repositories upload"})
    var self = this

    self.profile = Profile.instance

    self.upload = function(){
      background.postMessage({action:"repositories show media-group",filename:self.filename})
    }

    var worker = new window.Worker("/app/scripts/services/lib/UploadWorker.js")

    worker.onmessage = function(event){
      switch(event.data.status){
        case 201:
          self.disabled = false
          console.log("Done")
          $scope.$apply()
          break
        case 303:
          console.log("Processing:",event.data)
          break
        default:
          console.log(event.data)
      }
    }

    background.onMessage.addListener(function(res){
      var queue = [res.video, res.audio]

      self.disabled = true

      angular.forEach(queue,function(ele){
        var options = {
          name: ele.$name,
          lesson_id: self.lesson,
          type: ele.type,
          tags: self.tags || "",
          privilege: self.privacy,
          token: self.profile.credentials.access_token
        }

        worker.postMessage({
          command: 'start',
          filePath: ele.extensionPath,
          options: options
        })
      })
    })
  });
