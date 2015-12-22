'use strict';

/**
 * @ngdoc service
 * @name digitalclassApp.Encoder
 * @description
 * # canvasEncoder
 * Factory in the digitalclassApp.
 */

var WAIT_TIME_STOP_RECORDS = 600

var Encoder = (function(){
  var self = {}

  self.start = function(m_stream, bg_stream,options,onStop){
    if(!options) throw "Not found options"
    if(!m_stream) throw "Main stream is not null"

    var videoTracks = []
    DigitalClass.situation = DigitalClass.status.recording

    var m_blob_url = URL.createObjectURL(m_stream)
    var m_track = m_stream.getVideoTracks()[0]

    videoTracks.push(m_track)

    var main = document.createElement("video")
    main.src = m_blob_url
    main.width = options.width
    main.height = options.height
    main.track = videoTracks[0]
    main.play()

    main.track.onended = function(){
      self.stop(onStop)
      main = false
    }

    // Optional
    if(bg_stream){
      var bg_blob_url = URL.createObjectURL(bg_stream)
      var bg_track = bg_stream.getVideoTracks()[0]

      videoTracks.push(m_track)

      var bg = document.createElement("video")
      bg.src = m_blob_url
      bg.width = options.width
      bg.height = options.height
      bg.track = videoTracks[1]
      bg.play()
    }

    common.naclModule.postMessage({
      command: 'start',
      file_name: options.filename + ".webm",
      video_track: videoTracks,
      profile: 'vp8',
      width: main.width,
      height: main.height
    });

    // Microphone Device
    Microphone.filename = options.filename + ".wav"
    Microphone.startRecordingProcess()

    var response = {  main:{ video: main, src: m_blob_url }  }

    if(bg_stream){
      response.bg = {  video: bg,  src: bg_blob_url }
    }

    return response
  }

  self.stop = function(callback){
    if(DigitalClass.situation != DigitalClass.status.paused)
      Microphone.stopRecordingProcess(function(blob){
        fileSystem.save(Microphone.filename , blob)
        DigitalClass.situation = DigitalClass.status.done
      })

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

    // Stop Module
    setTimeout(function(){
      common.naclModule.postMessage({command: "stop"})
    }, WAIT_TIME_STOP_RECORDS)

    DigitalClass.situation = DigitalClass.status.paused
  }

  self.updateTrack = function(video){
    common.naclModule.postMessage({
      command: 'change_track',
      video_track: video.track
    });
  }

  // self.saveFrame = function(filename){
  //   var canvas = document.createElement("canvas")
  //   canvas.width = self.main.width
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
