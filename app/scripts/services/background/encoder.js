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

  self.start = function(stream,options,onStop){
    if(!options) throw "Not found options"

    DigitalClass.situation = DigitalClass.status.recording

    var videoTrack = stream.getVideoTracks()[0]
    var blobURL = URL.createObjectURL(stream)
    var saveDisk = options.hasOwnProperty('saveDisk')


    var element = document.createElement("video")
    element.src = blobURL
    element.width = options.width
    element.height = options.height
    element.track = videoTrack
    element.play()
    document.body.appendChild(element)

    element.track.onended = function(){
      self.stop(onStop)
      element = false
    }

    if(saveDisk && options.saveDisk){
      common.naclModule.postMessage({
        command: 'start',
        file_name: options.filename,
        video_track: element.track,
        profile: 'vp8',
        width: element.width,
        height: element.height
      });

      Microphone.startRecordingProcess()
    }

    return {video: element, src: blobURL }
  }

  self.stop = function(callback){
    common.naclModule.postMessage({command: "stop"})

    Microphone.stopRecordingProcess(function(blob){
      fileSystem.save(Microphone.filename , blob)
    })

    // Upadate Status
    DigitalClass.situation = DigitalClass.status.done
    // Callback User
    if(callback) callback()
    self.stopRecords()
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
  }

  self.updateTrack = function(video){
    common.naclModule.postMessage({
      command: 'change_track',
      video_track: video.track
    });
  }

  // self.saveFrame = function(filename){
  //   var canvas = document.createElement("canvas")
  //   canvas.width = self.element.width
  //   canvas.height = self.element.height
  //   var ctx = canvas.getContext("2d")
  //   ctx.drawImage(self.element,0,0)
  //   var base64 = canvas.toDataURL("image/png",0.1)
  //   console.log(base64)
  //   var blob = new Blob([base64],{type:"image/png"})
  //   fileSystem.save(filename+".png",blob)
  // }

  self.reload = function(){
    window.location.reload()
  }

  return self
}(Encoder))
