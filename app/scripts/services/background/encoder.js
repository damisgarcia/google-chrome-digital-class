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


    self.element = document.createElement("video")
    self.element.src = blobURL
    self.element.width = options.width
    self.element.height = options.height
    self.element.track = videoTrack
    self.element.play()

    console.log(self.element.src)

    self.element.track.onended = function(){
      self.stop(onStop)
    }

    common.naclModule.postMessage({
      command: 'start',
      file_name: options.filename,
      video_track: self.element.track,
      profile: 'vp8',
      width: self.element.width,
      height: self.element.height
    });

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
      DigitalClass.camStream.getVideoTracks()[0].stop()
    }
    if(DigitalClass.desktopStream != null && DigitalClass.desktopStream.active){
      DigitalClass.desktopStream.getVideoTracks()[0].stop()
    }
  }

  // self.reload = function(){
  //   window.location.reload()
  // }

  return self
}(Encoder))
