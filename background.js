// Copyright (c) 2013 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

var INITIALIZER_OPTIONS = {
  type:"popup",
  width: 320,
  height: 240,
  top: window.screen.availHeight,
  left: window.screen.availWidth
}

var INITIALIZER_TAB_ID = null


chrome.runtime.onConnect.addListener(function(port) {
  port.onMessage.addListener(function(res){
    if(res.action == "status"){
      port.postMessage({
        status: DigitalClass.situation
      })
    }
    else if(res.action == "desktop"){
      INITIALIZER_OPTIONS.url = "index.html#initializer/desktop"
      chrome.windows.create(INITIALIZER_OPTIONS,function(tabId){
        INITIALIZER_TAB_ID = tabId
      })
    }

    else if(res.action == "desktop request stream"){
      getUserScreen.getDesktop(function(stream){
        stream.onended = function(){
          port.postMessage({action:"stop stream"})
        }
        var uri = URL.createObjectURL(stream)
        var videoTrack = stream.getVideoTracks()[0]

        var desktop = document.createElement("video")
        var width = window.screen.width
        var height = window.screen.height

        desktop.src = uri
        desktop.width = width
        desktop.height = height
        desktop.track = videoTrack
        desktop.play()

        common.naclModule.postMessage({
          command: 'start',
          file_name: 'desktop.webm',
          video_track: videoTrack,
          profile: 'vp8',
          width: desktop.width,
          height: desktop.height
        });

        setTimeout(function(){
          common.naclModule.postMessage({
            command: "stop"
          });
        },5000)

        port.postMessage({action:"desktop request stream",stream:uri, videoTrack: videoTrack})
      })
    }
  })
})
