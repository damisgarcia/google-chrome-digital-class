'use strict'

/**
 * @ngdoc service
 * @name digitalclassApp.canvasEncoder*
 */

window.BUSY = false

var background = chrome.runtime.connect({name:"background app"})

angular.module('digitalclassApp',
    [
      'ngCookies',
      'ngDialog',
      'ngSanitize',
      'ngTagsInput',
      'com.2fdevs.videogular',
      'com.2fdevs.videogular.plugins.controls',
      'com.2fdevs.videogular.plugins.overlayplay',
      'com.2fdevs.videogular.plugins.poster',
      'ui.bootstrap',
      'ui.router'
    ]
  ).config(function($stateProvider, $urlRouterProvider) {
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

    .state('login', {
      url: "/login",
      views:{
        "main":{
          templateUrl: "app/views/login.html",
          controller: "LoginCtrl as login"
        }
      }
    })

    .state('profile', {
      url: "/profile",
      views:{
        "main":{
          templateUrl: "app/views/profile.html",
          controller: "ProfileCtrl as profile"
        }
      }
    })

    .state('configure', {
      url: "/configure",
      views:{
        "main":{
          templateUrl: "app/views/configure.html",
          controller: "ConfigureCtrl as configure"
        }
      }
    })

    .state('desktop', {
      url: "/desktop",
      views:{
        "main":{
          templateUrl: "app/views/desktop.html",
          controller: "DesktopCtrl as desktop"
        }
      }
    })

    .state('desktop-with-camera', {
      url: "/desktop-with-camera",
      views:{
        "main":{
          templateUrl: "app/views/desktop-with-camera.html",
          controller: "DesktopWithCameraCtrl as desktop_with_camera"
        }
      }
    })

    .state('webcam', {
      url: "/webcam",
      views:{
        "main":{
          templateUrl: "app/views/webcam.html",
          controller: "WebcamCtrl as webcam"
        }
      }
    })

    .state('repositories', {
      url: "/repositories",
      views:{
        "main":{
          templateUrl: "app/views/repositories.html",
          controller: "RepositoriesCtrl as repositories"
        }
      }
    })

    .state('repositories.show', {
      parent:'repositories',
      url: "/:fileName",
      views:{
        "main@":{
          templateUrl: "app/views/repositories-show.html",
          controller: "RepositoriesShowCtrl as repository"
        }
      }
    })

    .state('repositories.upload', {
      parent:'repositories',
      templateUrl: "app/views/repositories-upload.html",
      controller: "RepositoriesUploadCtrl as repository"
    })

})

.run(function($rootScope,$cookieStore,$state){
  var blacklist = ["repositories","configure","repositories.show"]

  $rootScope.$on('$stateChangeStart',function(event, toState, toParams, fromState, fromParams){
    console.log($cookieStore.get('profile'))
  })

  $rootScope.$on('$stateChangeSuccess',function(event, toState, toParams, fromState, fromParams){
    if(!fromState.name && !blacklist.includes(toState.name)){
      if($cookieStore.get('state')){
        var currentState = $cookieStore.get('state')
        $state.go(currentState)
      }
    }
  })

  $rootScope.$on('$viewContentLoading', function(event, viewConfig){
    background.postMessage({action:"status"})
    // Handle Message
    background.onMessage.addListener(function(res){
      // done
      if(res.status == 0){
        BUSY = false
      }
      // recording
      else if(res.status == 1){
        BUSY = true
      }
    })
  })
})
