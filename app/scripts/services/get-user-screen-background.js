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
             maxWidth:  window.screen.availWidth,
             maxHeight: window.screen.availHeight
           }
         }
       },callback,( onFail || self.fail ))
     })
   }

   self.fail = function(error){
     // DigitalClass.situation = DigitalClass.status.fail
     console.debug(error)
   }

   return self
 }(getUserScreen))
