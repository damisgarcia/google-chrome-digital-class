'use strict';

/**
 * @ngdoc function
 * @name digitalclassApp.controller:WebcamCtrl
 * @description
 * # WebcamCtrl
 * Controller of the digitalclassApp
 */
angular.module('digitalclassApp')
  .controller('WebcamCtrl', function ($scope,$state,$cookieStore) {
    // $cookieStore.put('state', $state.current.name)
    $.cookie('state', $state.current.name)

    var self = this
    $scope.busy = BUSY

    var background = chrome.runtime.connect({name:"background webcam"})

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
        preview.src = res.stream.main.src
      }
      else if(res.action == "take stream records"){
        var preview = document.getElementById('preview')
        if(res.$camera)
          preview.src = res.$camera
      }

      $scope.$apply()
    })

    this.start = function(){
      if(!BUSY){ // if false
        background.postMessage({action:"webcam request stream"})
      }
    }

    this.stop = function(){
      if(BUSY){ // if false
        background.postMessage({action:"stop records"})
      }
    }

    background.postMessage({action:"take stream records"})
  });
