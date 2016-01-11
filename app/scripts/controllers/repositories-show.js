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

      self.destroy = function(){
        if(confirm("Really delete this file"))
        background.postMessage({action:"repositories destroy", target: $stateParams.filePath})
      }

      // Chrome Port
      var background = chrome.runtime.connect({name:"background repositories show"})

      background.onMessage.addListener(function(res){
        if(res.action == "repositories show media-group"){

          self.filename = $stateParams.filePath

          self.video = {
            sources: [],
            theme: "bower_components/videogular-themes-default/videogular.css",
            processed: false,
            onUpdateState: function(state){
              var video = null
              switch (state) {
                case "play":
                  if(!self.video.processed){
                    video = $("video").get(0)
                    video.playbackRate = 10.0 // Acelerando o Vídeo
                  }
                  break;
                case "stop":
                  if(!self.video.processed){
                    video = $("video").get(0)
                    video.playbackRate = 1.0
                    video.currentTime = 0
                    video.play()

                    self.video.processed = true
                  }
                  break;
              }
            }
          }

          self.audio = {
            sources: [],
            theme: "bower_components/videogular-themes-default/videogular.css"
          }

          angular.forEach(res.media_group,function(media){
            switch (true) {
              case /\.wav$/.test(media.$name):
                self.audio.sources.push({src: $sce.trustAsResourceUrl(media.extensionPath), type: "audio/wav"})
                break
              case /\.webm$/.test(media.$name):
                self.video.sources.push({src: $sce.trustAsResourceUrl(media.extensionPath), type: "video/webm"})
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
