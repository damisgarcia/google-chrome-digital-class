'use strict';

/**
 * @ngdoc function
 * @name digitalclassApp.controller:RepositoriesShowCtrl
 * @description
 * # RepositoriesShowCtrl
 * Controller of the digitalclassApp
 */
  angular.module('digitalclassApp')
    .controller('RepositoriesShowCtrl', function ($state,$stateParams,$scope,$sce) {
      var self = this

      self.video = {
        onUpdateState: function(state){
          switch (state) {
            case "play":
              self.audio.api.play()
              break;
            case "pause":
              self.audio.api.pause()
              break;
            case "stop":
              self.audio.api.stop()
              break;
          }
        },
        onPlayerReady: function(api){
          self.video.api = api
          // Events
          var video = self.video.api.mediaElement[0]

          video.onvolumechange = function(evt){
            self.audio.api.mediaElement[0].volume = evt.target.volume
          }

          video.onseeked = function(evt){
            self.audio.api.mediaElement[0].currentTime = evt.target.currentTime
          }

          video.volume = 0.5
        }
      }

      self.audio = {
        onPlayerReady: function(api){
          self.audio.api = api
        }
      }

      self.destroy = function(){
        if(confirm("Really delete this file"))
        background.postMessage({action:"repositories destroy", target: $stateParams.filePath})
      }

      // Chrome Port
      var background = chrome.runtime.connect({name:"background repositories show"})

      background.onMessage.addListener(function(res){
        if(res.action == "repositories show media-group"){

          self.filename = $stateParams.filePath

          self.video.config = {
            sources: [],
            theme: "app/styles/videogular.css",
            processed: false
          }

          self.audio.config = {
            sources: [],
            theme: "app/styles/videogular.css"
          }

          angular.forEach(res.media_group,function(media){
            switch (true) {
              case /\.wav$/.test(media.$name):
                self.audio.config.sources.push({src: $sce.trustAsResourceUrl(media.extensionPath), type: "audio/wav"})
                break
              case /\.webm$/.test(media.$name):
                self.video.config.sources.push({src: $sce.trustAsResourceUrl(media.extensionPath), type: "video/webm"})
                break
              case /\.png$/.test(media.$name):
                self.poster = media.extensionPath
                break
              default:
                return false
            };
          })
        }
        else if(res.action = "repositories destroy"){
          $state.go("repositories")
        }
        $scope.$apply()
      })

      background.postMessage({action:"repositories show media-group",target: $stateParams.filePath })
    });
