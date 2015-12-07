'use strict';

/**
 * @ngdoc service
 * @name digitalclassApp.getUserMedia
 * @description
 * # getUserMedia
 * Factory in the digitalclassApp.
 */
angular.module('digitalclassApp')
  .factory('getUserMedia', function () {
    var getUserMedia = (function(){
      var self = {}

      self.getWebCam = function(callback,onFail){
        navigator.webkitGetUserMedia({
          video:true
        },callback,(onFail || self.WebCamFail))
      }

      self.fail = function(error){
        DigitalClass.situation = DigitalClass.status.fail
        console.debug(error)
      }

      return self
    }(getUserMedia))

    return getUserMedia
  });
