//
// @autor: Damis Garcia
//

'use strict'

window.big = true

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
  var element = document.getElementById("mediaUser")
  element.src = URL.createObjectURL(stream)
  element.track = window.MediaUserVideoTrack
  element.play()
  record("camera.webm",element)
}

function onSuccessMediaUserSmallVideo(stream){
  window.MediaUserSmallVideoTrack = stream.getVideoTracks()[0]
  var element = document.getElementById("mediaUserSmall")
  element.src = URL.createObjectURL(stream)
  element.track = window.MediaUserSmallVideoTrack
  element.play()
  record("camera-small.webm",element)
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
