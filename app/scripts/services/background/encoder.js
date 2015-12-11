'use strict';

/**
 * @ngdoc service
 * @name digitalclassApp.Encoder
 * @description
 * # canvasEncoder
 * Factory in the digitalclassApp.
 */
var Encoder = (function(){
  var self = {}

  self.element = null

  self.start = function(stream,options,onStop){
    if(!options) throw "Not found options"

    DigitalClass.situation = DigitalClass.status.recording

    var videoTrack = stream.getVideoTracks()[0]
    var blobURL = URL.createObjectURL(stream)
    var saveDisk = options.hasOwnProperty('saveDisk')


    self.element = document.createElement("video")
    self.element.src = blobURL
    self.element.width = options.width
    self.element.height = options.height
    self.element.track = videoTrack
    self.element.play()

    self.element.track.onended = function(){
      self.stop(onStop)
    }

    if(saveDisk && options.saveDisk){
      common.naclModule.postMessage({
        command: 'start',
        file_name: options.filename,
        video_track: self.element.track,
        profile: 'vp8',
        width: self.element.width,
        height: self.element.height
      });
    }

    return blobURL
  }

  self.stop = function(callback){
    if(!callback) throw "Not found return function"
    common.naclModule.postMessage({command: "stop"})
    // Stop all streams actives
    self.stopRecords()
    // Upadate Status
    DigitalClass.situation = DigitalClass.status.done
    // Callback User
    callback()
  }

  self.stopRecords = function(){
    if(DigitalClass.camStream != null && DigitalClass.camStream.active){
      DigitalClass.camStream.getVideoTracks().forEach(function(track){
        track.stop()
      })
    }
    if(DigitalClass.desktopStream != null && DigitalClass.desktopStream.active){
      DigitalClass.desktopStream.getVideoTracks().forEach(function(track){
        track.stop()
      })
    }
    if(DigitalClass.micStream != null && DigitalClass.micStream){
      DigitalClass.micStream.getAudioTracks().forEach(function(track){
        track.stop()
      })
    }
  }

  self.changeTrack = function(stream){
    self.element.track = stream.getVideoTracks()[0]
  }

  self.updateTrack = function(){
    common.naclModule.postMessage({
      command: 'change_track',
      video_track: self.element.track
    });
  }

  self.saveFrame = function(filename){
    var canvas = document.createElement("canvas")
    canvas.width = self.element.width
    canvas.height = self.element.height
    var ctx = canvas.getContext("2d")
    ctx.drawImage(self.element,0,0)
    var base64 = canvas.toDataURL("image/png",0.1)
    console.log(base64)
    var blob = new Blob([base64],{type:"image/png"})
    fileSystem.save(filename+".png",blob)
  }

  // self.reload = function(){
  //   window.location.reload()
  // }

  return self
}(Encoder))
