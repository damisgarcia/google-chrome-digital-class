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
        preview.src = res.stream
      }
      else if(res.action == "take stream records"){
        var preview = document.getElementById('preview')
        if(res.$desktop)
          preview.src = res.$desktop
      }

      $scope.$apply()
    })

    this.start = function(){
      if(!BUSY){ // if false
        background.postMessage({action:"desktop with camera request stream"})
      }
    }

    this.stop = function(){
      if(!BUSY){ // if false
        background.postMessage({action:"stop records"})
      }
    }

    background.postMessage({action:"take stream records"})
  });
