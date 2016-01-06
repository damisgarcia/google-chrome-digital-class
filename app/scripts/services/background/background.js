'use strict'

var RELOAD_WAIT = 3000
var PNG_REGEX =   /\.png$/
var WEBM_REGEX =  /\.webm$/
var WAV_REGEX =   /\.wav$/


// Comunication with NACL modules
function moduleDidLoad() {
  // The module is not hidden by default so we can easily see if the plugin
  // failed to load.

  var $mediaStreams, $desktopInRecorder
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
            filename: filename,
            width: window.screen.width,
            height: window.screen.height,
            saveDisk: true
          }

          function onstop(){
            checkout(filename)
          }

          var response = Encoder.start(stream,null,options,onstop)
          port.postMessage({action:"desktop request stream",stream: response, status: DigitalClass.situation})
        })
      }

      else if(res.action == "webcam request stream"){
        getUserMedia.getWebCam(function(stream){
          DigitalClass.camStream = stream
          var filename = DigitalClass.$generateFileName()
          var options = {
            filename: filename,
            width: 640,
            height: 480,
            saveDisk: true
          }

          function onstop(){
            checkout(filename)
          }

          var response = Encoder.start(stream,null,options,onstop)
          port.postMessage({ action:"webcam request stream",stream: response, status: DigitalClass.situation })
        })
      }

      else if(res.action == "desktop with camera request stream"){
        var filename = DigitalClass.$generateFileName()
        getUserScreen.getDesktop(function(stream){
          DigitalClass.desktopStream = stream
          getUserMedia.getWebCam(function(stream){
            DigitalClass.camStream = stream

            var options = {
              filename: filename,
              width: window.screen.width,
              height: window.screen.height,
            }

            function onstop(){
              checkout(filename)
            }

            var response = Encoder.start(DigitalClass.desktopStream, DigitalClass.camStream, options, onstop)
            port.postMessage({action:"webcam request stream", stream: response, status: DigitalClass.situation})
          })

          // Set Primary View
          $desktopInRecorder = true
        })
      }
      else if (res.action == "focus desktop") {
        Encoder.updateTrack("desktop")
        $desktopInRecorder = true
      }

      else if (res.action == "focus webcam") {
        Encoder.updateTrack("webcam")
        $desktopInRecorder = false
      }
      // Repositories Routes
      else if(res.action == "repositories list"){
        fileSystem.list(function(repositories){
          port.postMessage({action:"repositories list",files: repositories.reverse()})
        })
      }

      else if(res.action == "repositories show"){
        fileSystem.find_by_name(res.filename,function(f){
          port.postMessage({action:"repositories show",file: f})
        })
      }

      else if(res.action == "repositories edit"){
        fileSystem.mvdir(res.past_name,res.new_name,function(repository){
          fileSystem.$list(repository,function(result){
            port.postMessage({action:"repositories list",files: result.reverse()})
          })
        })
      }

      else if(res.action == "repositories show media-group"){
        fileSystem.open(res.target,function(result){
          port.postMessage({action:"repositories show media-group",media_group: result})
        })
      }


      else if(res.action == "repositories destroy"){
        var is_file_regex = /[\.[\d\w]$/
        if(is_file_regex.test(res.target)){
          fileSystem.find_by_name(res.target,function(f){
            fileSystem.destroy(f,function(){
              console.log("File Destroy")
            })
          })
        } else{
          fileSystem.rmdir(res.target,function(f){
            fileSystem.list(function(repositories){
              port.postMessage({action:"repositories list",files: repositories.reverse()})
            })
          })
        }
      }
    })
  })
}

function checkout(filename){
  var formats = [".webm",".wav",".png"]
  var files = []
  var redirect = filename

  formats.forEach(function(format){
    fileSystem.find_by_name(filename + format, function(f){
      files.push(f)
    })
  })
  moveCaptures(filename, files)
  callRepositoryWindow(redirect)
}

function callRepositoryWindow(filename){
  setTimeout( function(){
    chrome.tabs.create({url:"/index.html#/repositories/"+filename}, null)
  }, RELOAD_WAIT)
}

function moveCaptures(dirname,array_files){
  fileSystem.mkdir(dirname,function(DataFolder){
    array_files.forEach(function(file){
      if(PNG_REGEX.test(file.$name)){
        file.moveTo(DataFolder,"poster.png")
      }
      else if(WEBM_REGEX.test(file.$name)){
        file.moveTo(DataFolder,"video.webm")
      }
      else if(WAV_REGEX.test(file.$name)){
        file.moveTo(DataFolder,"audio.wav")
      }
      else{
        file.moveTo(DataFolder)
      }
    })
  })
}


/**
 * Add the default "load" and "message" event listeners to the element with
 * id "listener".
 *
 * The "load" event is sent when the module is successfully loaded. The
 * "message" event is sent when the naclModule posts a message using
 * PPB_Messaging.PostMessage() (in C) or pp::Instance().PostMessage() (in
 * C++).
 */
