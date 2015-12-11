// Copyright (c) 2013 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict'
//
// Comunication with NACL modules
//



function moduleDidLoad() {
  // The module is not hidden by default so we can easily see if the plugin
  // failed to load.
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

        port.postMessage({action:"take stream records", $camera: camera, $desktop: desktop, $mic:mic })
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

          var blobURL = Encoder.start(stream,options,onstop)
          port.postMessage({action:"desktop request stream",stream: blobURL, status: DigitalClass.situation})
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

          var blobURL = Encoder.start(stream,options,onstop)
          port.postMessage({ action:"webcam request stream",stream: blobURL, status: DigitalClass.situation })
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

            var blobURL = Encoder.start(stream,options,onstop)
            port.postMessage({ action:"webcam request stream",stream: blobURL, status: DigitalClass.situation })
          })

          var options = {
            filename: filename + "_desktop" + ".webm",
            width: window.screen.width,
            height: window.screen.height,
            saveDisk: true
          }

          function onstop(){
            chrome.tabs.create({url: DigitalClass.filesystem + options.filename})
          }

          var blobURL = Encoder.start(stream,options,onstop)

          setTimeout(function(){
            Encoder.changeTrack(DigitalClass.camStream)
            Encoder.updateTrack()
          },5000)

          port.postMessage({action:"desktop request stream",stream: blobURL, status: DigitalClass.situation})
        })
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
