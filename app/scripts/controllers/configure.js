'use strict';

/**
 * @ngdoc function
 * @name digitalclassApp.controller:ConfigureCtrl
 * @description
 * # ConfigureCtrl
 * Controller of the digitalclassApp
 */
angular.module('digitalclassApp')
  .controller('ConfigureCtrl', function () {
    function onSuccess(stream){
      stream.onended = function(){
        this.log = "Sucesso"
      }      

      stream.getAudioTracks().forEach(function(track){
        track.stop()
      })

      stream.getVideoTracks().forEach(function(track){
        track.stop()
      })
    }

    function onFail(error){
      console.log(error)
    }

    navigator.webkitGetUserMedia({video:true,audio:true},onSuccess,onFail)
  });
