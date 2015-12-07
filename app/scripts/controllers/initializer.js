'use strict';

/**
 * @ngdoc function
 * @name digitalclassApp.controller:InitializerCtrl
 * @description
 * # InitializerCtrl
 * Controller of the digitalclassApp
 */
angular.module('digitalclassApp')
  .controller('InitializerCtrl', function ($stateParams,$timeout,getUserMedia) {
    var background = chrome.runtime.connect({name:"desktop request stream"})

    background.onMessage.addListener(function(res){
      if(res.action == "desktop request stream"){
        var preview = document.getElementById('preview')
        preview.src = res.stream
        preview.width = 320
        preview.play()        
      }
    })

    if($stateParams.mode == "desktop"){
      background.postMessage({action:"desktop request stream"})
    }

    if($stateParams.mode == "stop stream"){
      background.postMessage({action:"desktop request stream"})
    }
  });
