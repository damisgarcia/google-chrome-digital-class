'use strict'

/**
 * @ngdoc service
 * @name digitalclassApp.canvasEncoder*
 */

window.BUSY = false

angular.module('digitalclassApp',['ui.bootstrap','ui.router']).config(function($stateProvider, $urlRouterProvider) {
  // If route is not exist
  $urlRouterProvider.otherwise("/home");
  // Routes
  $stateProvider
    .state('home', {
      url: "/home",
      views:{
        "main":{
          templateUrl: "app/views/home.html",
          controller: "HomeCtrl as home"
        }
      }
    })

    .state('desktop', {
      url: "/desktop",
      views:{
        "main":{
          controller: "DesktopCtrl as desktop"
        }
      }
    })

    .state('initializer', {
      url: "/initializer/:mode",
      views:{
        "main":{
          controller: "InitializerCtrl as initializer",
          templateUrl: "app/views/initializer.html"
        }
      }
    })

    .state('busy',{
      url: "/busy",
      views:{
        "main":{
          templateUrl: "app/views/busy.html"
        }
      }
    })

  $urlRouterProvider.rule(function($injector, $location){
    var background = chrome.runtime.connect({name:"background app"})
    background.postMessage({action:"status"})
    // Handle Message
    background.onMessage.addListener(function(res){
      // paused
      if(res.status == 0){
        BUSY = false
      }
      // recording
      else if(res.status == 1){
        BUSY = true
      }
      // processing
      else if(res.status == 2){
        BUSY = true
      }
      // processed
      else if(res.status == 3){
        BUSY = true
      }
      // canceled
      else if(res.status == 4){
        BUSY = false
      }
      // success
      else if(res.status == 5){
        BUSY = true
      }
      // failed
      else if(res.status == 6){
        BUSY = false
      }
      // done
      else if(res.status == 7){
        BUSY = false
      }
      BUSY ? $location.path("/busy") : false
    })
  })
})
