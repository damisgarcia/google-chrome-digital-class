// Copyright 2015 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

var dataArray;

const MIME_TYPE = "application/octet-stream";

function $(id) {
  return document.getElementById(id);
}

var $screen

function startRecord() {
  // $('length').innerHTML = ' Size: ' + dataArray.byteLength + ' bytes';

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
    },success,failure)
  })

  // $('start').disabled = true;
  // $('stop').disabled = false;
  // cleanupDownload();
}

function success(stream) {
  var videoTrack = stream.getVideoTracks()[0];
  var $screen = document.getElementById('video')
  // var preview = $('video')
  var uri = URL.createObjectURL(stream)
  $screen.width = 1920
  $screen.height = 1080
  $screen.src = uri
  $screen.track = videoTrack;
  $screen.play();

  // preview.src = uri
  // preview.play()

  common.naclModule.postMessage({
    command: 'start',
    file_name: 'video.webm',
    video_track: videoTrack,
    profile: 'vp8',
    width: $screen.width,
    height: $screen.height
  });
}

function failure(e) {
  common.logMessage("Error: " + e);
}


function cleanupDownload() {
  var download = $('download');
  if (!download)
    return;
  download.parentNode.removeChild(download);
}

function appendDownload(parent, blob, filename) {
  var a = document.createElement('a');
  a.id = "download";
  a.download = filename;
  a.href = window.URL.createObjectURL(blob);
  a.textContent = 'Download';
  a.dataset.downloadurl = [MIME_TYPE, a.download, a.href].join(':');
  parent.appendChild(a);
}

function stopRecord() {
  common.naclModule.postMessage({
    command: "stop"
  });
  $screen.stop()
  $screen.track = null

  // var video = $('video');
  // video.pause();
  // video.track.stop();
  // video.track = null;
  // video.src = "filesystem:chrome-extension://palonojnmheogjnhphppgofmjhlabecp/persistent/video.webm"
  // video.load()
  // video.play()
  //
  // $('start').disabled = false;
  // $('stop').disabled = true;
}

function handleMessage(msg) {
  if (msg.data.name == 'data') {
    appendData(msg.data.data);
  } else if (msg.data.name == 'supportedProfiles') {
    common.logMessage('profiles: ' + JSON.stringify(msg.data.profiles));
    var profileList = $('profileList');
    for (var node in profileList.childNodes)
      profileList.remove(node);
    for (var i = 0; i < msg.data.profiles.length; i++) {
      var item = document.createElement('option');
      item.label = item.value = msg.data.profiles[i];
      profileList.appendChild(item);
    }
    $('start').disabled = !(msg.data.profiles.length > 0);
  } else if (msg.data.name == 'log') {
    common.logMessage(msg.data.message);
  }
}

function resetData() {
  dataArray = new ArrayBuffer(0);
}

function appendData(data) {
  var tmp = new Uint8Array(dataArray.byteLength + data.byteLength);
  tmp.set(new Uint8Array(dataArray), 0 );
  tmp.set(new Uint8Array(data), dataArray.byteLength);
  dataArray = tmp.buffer;
  $('length').textContent = ' Size: ' + dataArray.byteLength + ' bytes';
}

function attachListeners() {
  resetData()
  startRecord()
  setTimeout(function(){
    stopRecord()
  },5000)
  // $('start').addEventListener('click', function (e) {
  //   resetData();
  //   startRecord();
  // });
  // $('stop').addEventListener('click', function (e) {
  //   stopRecord();
  // });
}

// Called by the common.js module.
function moduleDidLoad() {
  // The module is not hidden by default so we can easily see if the plugin
  // failed to load.
  common.hideModule();
}
