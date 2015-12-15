// Copyright (c) 2013 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict'

// Comunication with NACL modules
function moduleDidLoad() {
  // The module is not hidden by default so we can easily see if the plugin
  // failed to load.
  var $desktop, $camera, $desktopInRecorder
  chrome.runtime.onConnect.addListener(function(port) {
    port.onMessage.addListener(function(res){
      if(res.action == "status"){
        port.postMessage({
          status: DigitalClass.situation
        })
      }

      else if(res.action == "stop records"){
        Encoder.stopRecords()
      }

      else if(res.action == "take stream records"){
        var camera = StreamHelper.to_url(DigitalClass.camStream)
        var desktop = StreamHelper.to_url(DigitalClass.desktopStream)
        var mic = StreamHelper.to_url(DigitalClass.micStream)
        port.postMessage({action:"take stream records", $camera: camera, $desktop: desktop, $mic:mic, desktop_is_focus: $desktopInRecorder, status: DigitalClass.situation })
      }

      else if(res.action == "desktop request stream"){
        getUserScreen.getDesktop(function(stream){
          DigitalClass.desktopStream = stream
          var filename = DigitalClass.$generateFileName()

          var options = {
            filename: filename + ".webm",
            width: window.screen.width,
            height: window.screen.height
          }

          function onstop(){
            console.debug("Video Done!")
          }

          getUserMedia.getMicrophone(function(stream){
            DigitalClass.micStream = stream

            stream.onended = function(){
              getUserMedia.stopRecordMicrophone(function(blob){
                fileSystem.save(filename + ".wav",blob)
                chrome.tabs.create({url: "index.html#repositories/" + options.filename})
              })
            }
            getUserMedia.startRecordMicrophone(stream)
          })

          var response = Encoder.start(stream,options,onstop)
          port.postMessage({action:"desktop request stream",stream: response.src, status: DigitalClass.situation})
        })
      }

      else if(res.action == "webcam request stream"){
        getUserMedia.getWebCam(function(stream){
          DigitalClass.camStream = stream
          var filename = DigitalClass.$generateFileName()
          var options = {
            filename: filename + ".webm",
            width: 640,
            height: 480
          }

          function onstop(){
            console.debug("Video stream Done!")
          }

          getUserMedia.getMicrophone(function(stream){
            DigitalClass.micStream = stream

            stream.onended = function(){
              getUserMedia.stopRecordMicrophone(function(blob){
                fileSystem.save(filename + ".wav",blob)
                chrome.tabs.create({url: "index.html#repositories/" + options.filename})
              })
            }
            getUserMedia.startRecordMicrophone(stream)
          })

          var response = Encoder.start(stream,options,onstop)
          port.postMessage({ action:"webcam request stream",stream: response.src, status: DigitalClass.situation })
        })
      }

      else if(res.action == "desktop with camera request stream"){
        var filename = DigitalClass.$generateFileName()
        getUserScreen.getDesktop(function(stream){
          DigitalClass.desktopStream = stream
          getUserMedia.getWebCam(function(stream){
            DigitalClass.camStream = stream

            var options = {
              width: 640,
              height: 480
            }

            function onstop(){
              setTimeout(function(){
                chrome.tabs.create({url: "index.html#repositories/" + filename + ".webm"})
              },2000)
            }

            // getUserMedia.getMicrophone(function(stream){
            //   DigitalClass.micStream = stream
            //   stream.onended = function(){
            //     getUserMedia.stopRecordMicrophone(function(blob){
            //       fileSystem.save(filename + ".wav",blob)
            //       chrome.tabs.create({url: "index.html#repositories/" + filename + ".webm"})
            //     })
            //   }
            //   getUserMedia.startRecordMicrophone(stream)
            // })

            $camera = Encoder.start(stream,options,onstop)
            port.postMessage({ action:"webcam request stream", stream: $camera.src, status: DigitalClass.situation })
          })

          var options = {
            filename: filename + ".webm",
            width: window.screen.width,
            height: window.screen.height,
            saveDisk: true
          }

          $desktop = Encoder.start(stream,options,null)
          // Set Primary View
          $desktopInRecorder = true
          port.postMessage({action:"desktop request stream",stream: $desktop.src, status: DigitalClass.situation})
        })
      }
      else if (res.action == "focus desktop") {
        if($desktop) Encoder.updateTrack($desktop.video)
        $desktopInRecorder = true
      }

      else if (res.action == "focus webcam") {
        if($camera) Encoder.updateTrack($camera.video)
        $desktopInRecorder = false
      }
      // Repositories Routes
      else if(res.action == "repositories list"){
        fileSystem.list(function(repositories){
          port.postMessage({action:"repositories list",files: repositories})
        })
      }

      else if(res.action == "repositories show"){
        fileSystem.find_by_name(res.filename,function(f){
          port.postMessage({action:"repositories show",file: f})
        })
      }

      else if(res.action == "repositories show media-group"){
        var video, audio
        fileSystem.find_by_name(res.filename + ".webm",function(f){
          video = f
          fileSystem.find_by_name(res.filename + ".wav",function(f){
            audio = f
            port.postMessage({action:"repositories show media-group",video: video, audio: audio})
          })
        })
      }

      else if(res.action == "repositories destroy"){
        fileSystem.find_by_name(res.filename,function(f){
          fileSystem.destroy(f,function(){
            fileSystem.list(function(repositories){
              port.postMessage({action:"repositories list",files: repositories})
            })
          })
        })
      }
    })
  })
}
