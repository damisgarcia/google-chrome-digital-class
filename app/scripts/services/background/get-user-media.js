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

  self.getMicrophone = function(callback,onFail){
    navigator.webkitGetUserMedia({ audio: self.Microphone.mandatory },callback,(onFail || self.fail))
  }

  self.startRecordMicrophone = function(stream){
    self.Microphone.Recorder = RecordRTC(stream,{type:"audio", bufferSize: 16384})
    self.Microphone.Recorder.startRecording()
  }

  self.stopRecordMicrophone = function(callback){
    if(!callback) throw "Not found return function"
    self.Microphone.Recorder.stopRecording(function(url){
      callback(self.Microphone.Recorder.getBlob())
    })
  }

  self.Microphone = {}
  self.Microphone.Recorder = null
  self.Microphone.mandatory = {
    mandatory: {
     echoCancellation: false, // disable track processing modules
     googAutoGainControl: true, // optional
     googNoiseSuppression: true, // optional
     googHighpassFilter: true, // optional
     googTypingNoiseDetection: true // optional
    },
    optional: [{
     googAudioMirroring: false  // disable it as well
    }]
  }

  self.fail = function(error){
    console.debug(error)
    DigitalClass.situation = DigitalClass.status.done
  }


  return self
}(getUserMedia,window))
