//
// @autor: Damis Garcia
//

'use strict'

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
  var videoTrack = stream.getVideoTracks()[0]
  var element = document.getElementById("mediaUser")
  element.src = URL.createObjectURL(stream)
  element.track = videoTrack
  element.play()
  record("camera.webm",element)
}

function onSuccessMediaUserSmallVideo(stream){
  var videoTrack = stream.getVideoTracks()[0]
  var element = document.getElementById("mediaUserSmall")
  element.src = URL.createObjectURL(stream)
  element.track = videoTrack
  element.play()
  record("camera-small.webm",element)
}

function onFailMediaUser(error){
  console.debug(error)
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

  // Wait 5s to stop recorder
  setTimeout(function(){
    common.naclModule.postMessage({command: "stop"})
  },5000)
}
