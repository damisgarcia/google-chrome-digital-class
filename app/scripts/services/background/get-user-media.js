'use strict';

/**
 * @ngdoc service
 * @name digitalclassApp.getUserMedia
 * @description
 * # getUserMedia
 * Factory in the digitalclassApp.
 */

var getUserMedia = (function(){
  var self = {}


  self.getWebCam = function(callback,onFail){
    navigator.webkitGetUserMedia({
      video:true
    },callback,(onFail || self.fail))
  }  

  self.fail = function(error){
    DigitalClass.situation = DigitalClass.status.done
  }

  return self
}(getUserMedia,window))
