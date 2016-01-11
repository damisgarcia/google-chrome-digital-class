'use strict';

/**
 * @ngdoc function
 * @name digitalclassApp.controller:RepositoriesUploadCtrl
 * @description
 * # RepositoriesUploadCtrl
 * Controller of the digitalclassApp
 */

 var PNG_REGEX =   /\.png$/
 var WEBM_REGEX =  /\.webm$/
 var WAV_REGEX =   /\.wav$/

angular.module('digitalclassApp')
  .controller('RepositoriesUploadCtrl', function ($scope,$timeout,ngDialog) {
    var background = chrome.runtime.connect({name:"background repositories upload"})
    var self = this

    self.profile = Profile

    self.target_folder = $scope.$parent.repositories.select_file.$name

    self.upload = function(){
      background.postMessage({action:"repositories show media-group",target:self.filename})
    }

    var worker = new window.Worker("/app/scripts/services/lib/UploadWorker.js")

    worker.onmessage = function(event){
      switch(event.data.status){
        case 201:
          self.disabled = false
          console.log("Done")
          background.postMessage({action:"repositories markfolder",target: self.target_folder})
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
      var queue = res.media_group
      self.disabled = true

      angular.forEach(queue,function(ele){
        var name = null

        if(WEBM_REGEX.test(ele.$name)){
          ele.type = "video"
          name = res.parent + "/" + ele.$name
        }

        if(WAV_REGEX.test(ele.$name)){
          ele.type = "audio"
          name = res.parent + "/" + ele.$name
        }

        var options = {
          name: name,
          parent: res.parent,
          lesson_id: self.lesson,
          type: ele.type,
          tags: self.tags || "",
          privilege: self.privacy,
          token: self.profile.data.credentials.access_token
        }
        if(ele.type){
          worker.postMessage({
            command: 'start',
            filePath: ele.extensionPath,
            options: options
          })
        }
      })
    })
  });
