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
    var background = chrome.runtime.connect({name:"background repositories show"})
    self.filename = $stateParams.fileName.match(/(.*)\.[^.]+$/)[1]
    self.mediaGroup = {}

    background.onMessage.addListener(function(res){
      if(res.action == "repositories show media-group"){
        self.mediaGroup.video = res.video
        self.mediaGroup.audio = res.audio
        console.log(res)
        self.video = {
  				sources: [
  					{src: $sce.trustAsResourceUrl(self.mediaGroup.video.extensionPath), type: "video/webm"},
  				],
  				theme: "bower_components/videogular-themes-default/videogular.css"
  			}

        self.audio = {
  				sources: [
  					{src: $sce.trustAsResourceUrl(self.mediaGroup.audio.extensionPath), type: "audio/wav"},
  				],
  				theme: "bower_components/videogular-themes-default/videogular.css"
  			}
      }
      else if(res.action = "repositories destroy"){
        $state.go("repositories")
      }
      $scope.$apply()
    })

    self.destroy = function(){
      if(confirm("Really delete this file"))
      background.postMessage({action:"repositories destroy", filename: self.file.$name})
    }
    background.postMessage({action:"repositories show media-group",filename: self.filename })
  });
