'use strict';

/**
 * @ngdoc function
 * @name digitalclassApp.controller:RepositoriesUploadCtrl
 * @description
 * # RepositoriesUploadCtrl
 * Controller of the digitalclassApp
 */
angular.module('digitalclassApp')
  .controller('RepositoriesUploadCtrl', function ($scope,$cookieStore,$timeout) {
    var self = this
    self.profile = $cookieStore.get('profile')

    self.upload = function(){
      var options = {
        name: self.filename,
        lesson_id: self.lesson,
        type: "video",
        tags: self.tags,
        privilege: self.privilege,
        token: self.profile.credentials.access_token
      }

      self.disabled = true

      worker.postMessage({
        command: 'start',
        filePath: "filesystem:chrome-extension://aiikidlhbncdaccodnmdffbgoepgaock/persistent/screen-camera.webm",
        options: options
      })

      worker.postMessage({
        command: 'situation'
      })

      $timeout(function(){
        worker.postMessage({
          command: 'situation'
        })
      },200)
    }

    var worker = new window.Worker("/app/scripts/services/lib/UploadWorker.js")

    worker.onmessage = function(event){
      if(event.data.status == 201){
        self.disabled = false
      }
    }
  });
