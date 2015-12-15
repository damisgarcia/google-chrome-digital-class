'use strict';

/**
 * @ngdoc service
 * @name digitalclassApp.getUserMedia
 * @description
 * # getUserMedia
 * Factory in the digitalclassApp.background
 */

 var getUserScreen = (function(){
   var self = {}

   self.getDesktop = function(callback,onFail){
     chrome.desktopCapture.chooseDesktopMedia(['window','screen'], function(desktop_id){
       navigator.webkitGetUserMedia({
         audio: false,
         video: {
           mandatory: {
             chromeMediaSource: 'desktop',
             chromeMediaSourceId: desktop_id,
             maxWidth:  window.screen.width,
             maxHeight: window.screen.height
           }
         }
       },callback,( onFail || self.fail ))
     })
   }

   self.fail = function(error){
     console.debug(error)
     DigitalClass.situation = DigitalClass.status.done
   }

   return self
 }(getUserScreen))
