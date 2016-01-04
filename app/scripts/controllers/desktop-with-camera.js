'use strict';

/**
 * @ngdoc function
 * @name digitalclassApp.controller:DesktopWithCameraCtrl
 * @description
 * # DesktopWithCameraCtrl
 * Controller of the digitalclassApp
 */
angular.module('digitalclassApp')
  .controller('DesktopWithCameraCtrl', function ($scope,$state,$cookieStore) {
    $cookieStore.put('state', $state.current.name)
    var self = this
    var background = chrome.runtime.connect({name:"background desktop with camera"})
    background.onMessage.addListener(function(res){
      // done
      if(res.status == 0){
        BUSY = false
        $scope.busy = BUSY
      }
      // recording
      else if(res.status == 1){
        BUSY = true
        $scope.busy = BUSY
      }

      if(res.stream){
        var preview = document.getElementById('preview')
        var webcam = document.getElementById('webcam')
        preview.src = res.stream.main.src
        webcam.src = res.stream.bg.src
      }

      else if(res.action == "take stream records"){
        var webcam = document.getElementById('webcam')
        var preview = document.getElementById('preview')
        self.desktopFocus = res.desktop_is_focus
        if(res.$desktop)
          preview.src = res.$desktop
        if(res.$camera)
          webcam.src = res.$camera
      }
      $scope.$apply()
    })

    this.start = function($event){
      $event.preventDefault()
      if(!BUSY){ // if false
        background.postMessage({action:"desktop with camera request stream"})
      }
    }

    this.stop = function($event){
      $event.preventDefault()
      if(BUSY){
        background.postMessage({action:"stop records"})
      }
    }

    this.change = function(focus,$event){
      $event.preventDefault()
      if(focus == 'desktop'){
        this.desktopFocus = true
        background.postMessage({action:"focus desktop"})
      }
      else if(focus == 'webcam'){
        this.desktopFocus = false
        background.postMessage({action:"focus webcam"})
      }
    }


    background.postMessage({action:"take stream records"})
  });
