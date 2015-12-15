'use strict'

function moduleDidLoad() {
  var startBtn = document.getElementById('start')
  startBtn.onclick = function(){
    Microphone.startRecordingProcess()
  }
  var stopBtn = document.getElementById('stop')
  stopBtn.onclick = function(){
    Microphone.stopRecordingProcess(function(event){
      fileSystem.save("microphone-test.wav", event.data.blob)
      console.log("Success: Please open fileSystem Chrome Extension for lesson wav ")
    })
  }
}
