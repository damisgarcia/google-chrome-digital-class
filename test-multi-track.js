//
// @autor: Damis Garcia
//

'use strict'

window.big = true
var videoBg;
var videoSm;

function record(filename,video){
  common.naclModule.postMessage({
    command: 'start',
    file_name: filename,
    video_track: video.track,
    profile: 'vp8',
    width: video.width,
    height: video.height
  });
}


function onSuccessStream(stream){
  window.MediaUserVideoTrack = stream.getVideoTracks()[0]
  videoBg = document.getElementById("mediaUser")
  videoBg.src = URL.createObjectURL(stream)
  videoBg.width = window.screen.width
  videoBg.height = window.screen.height
  videoBg.track = window.MediaUserVideoTrack
  videoBg.play()
  record("screen-camera.webm",videoBg)  
}

function onSuccessMediaUserSmallVideo(stream){
  window.MediaUserSmallVideoTrack = stream.getVideoTracks()[0]
  videoSm = document.getElementById("mediaUserSmall")
  videoSm.src = URL.createObjectURL(stream)
  videoSm.track = window.MediaUserSmallVideoTrack
  videoSm.play()
}

function onFailMediaUser(error){
  console.debug(error)
}

window.$stop = function (e){
  e.preventDefault()
  common.naclModule.postMessage({command: "stop"})
}

 window.$switch = function(e){
  e.preventDefault()
  big ? big = false : big = true
  common.naclModule.postMessage({
    command: 'change_track',
    video_track: videoSm.track
  });
  if(big){
    console.log(window.MediaUserSmallVideoTrack)
  } else{
    console.log(window.MediaUserVideoTrack)
  }
}

function moduleDidLoad() {
  // The module is not hidden by default so we can easily see if the plugin
  // failed to load.
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
    },onSuccessStream,onFailMediaUser)
  })

  navigator.webkitGetUserMedia({
    video:true
  },onSuccessMediaUserSmallVideo,onFailMediaUser)

  document.getElementById('stop').onclick = $stop
  document.getElementById('switch').onclick = $switch
}
