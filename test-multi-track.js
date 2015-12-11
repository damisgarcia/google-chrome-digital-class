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


function onSuccessMediaUser(stream){
  window.MediaUserVideoTrack = stream.getVideoTracks()[0]
  videoBg = document.getElementById("mediaUser")
  videoBg.src = URL.createObjectURL(stream)
  videoBg.track = window.MediaUserVideoTrack
  videoBg.play()
  //record("camera.webm",videoBg)
}

function onSuccessMediaUserSmallVideo(stream){
  window.MediaUserSmallVideoTrack = stream.getVideoTracks()[0]
  videoSm = document.getElementById("mediaUserSmall")
  videoSm.src = URL.createObjectURL(stream)
  videoSm.track = window.MediaUserSmallVideoTrack
  videoSm.play()
  record("camera-small.webm",videoSm)
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
    video_track: videoBg.track
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
  navigator.webkitGetUserMedia({
    video:true
  },onSuccessMediaUser,onFailMediaUser)

  navigator.webkitGetUserMedia({
    video:true
  },onSuccessMediaUserSmallVideo,onFailMediaUser)

  document.getElementById('stop').onclick = $stop
  document.getElementById('switch').onclick = $switch
}
