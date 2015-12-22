//
// @autor: Damis Garcia
//

var Microphone = ( function(){
  var audioContext = new AudioContext;
  if (audioContext.createScriptProcessor == null)
    audioContext.createScriptProcessor = audioContext.createJavaScriptNode;

  var microphone

  var microphone = undefined,     // obtained by user click
      microphoneLevel = audioContext.createGain(),
      mixer = audioContext.createGain(),
      input = audioContext.createGain(),
      processor = undefined;      // created on recording

  var mandatory = {
    mandatory: {
     echoCancellation: false, // disable track processing modules
     googAutoGainControl: true, // optional
     googNoiseSuppression: true, // optional
     googHighpassFilter: true, // optional
     googTypingNoiseDetection: true // optional
    },
    optional: [{
     googAudioMirroring: false  // disable it as well
    }]
  }

  microphoneLevel.gain.value = 0.5;
  microphoneLevel.connect(mixer);
  mixer.connect(input);  
  var BUFFER_SIZE = 2048
  var QUALITY =  0.2

  // recording process
  var worker = new Worker('/app/scripts/services/lib/OggEncoderWorker.js'),
      encoder = undefined; // used on encodingProcess == direct

  function getBuffers(event) {
    var buffers = [];
    for (var ch = 0; ch < 2; ++ch)
      buffers[ch] = event.inputBuffer.getChannelData(ch);
    return buffers;
  }

  function startRecordingProcess() {
    var bufSz = BUFFER_SIZE,
        quality = QUALITY;
    processor = audioContext.createScriptProcessor(bufSz, 2, 2);
    input.connect(processor);
    processor.connect(audioContext.destination);
    worker.postMessage({
      command: 'start',
      process: 'separate',
      sampleRate: audioContext.sampleRate,
      numChannels: 2,
      quality: quality
    });
    processor.onaudioprocess = function(event) {
      worker.postMessage({ command: 'record', buffers: getBuffers(event) });
    };
  }

  function stopRecordingProcess() {
    input.disconnect();
    processor.disconnect();
    worker.postMessage({ command: 'finish'});
  }

  function onUserGetMediaStreamSuccess(stream){
    microphone = audioContext.createMediaStreamSource(stream)
    microphone.connect(microphoneLevel)
    startRecordingProcess()
    DigitalClass.micStream = stream
  }

  function onUserGetMediaStreamFail(error){
    console.log(error)
  }

  function garbageCollector(){
    if(DigitalClass.micStream != null && DigitalClass.micStream){
      DigitalClass.micStream.getAudioTracks().forEach(function(track){
        track.stop()
      })
    }
  }

  // Public API
  var self = {}
  self.startRecordingProcess = function(callback,onStop){
    navigator.webkitGetUserMedia({audio:mandatory},onUserGetMediaStreamSuccess,onUserGetMediaStreamFail)
  }

  self.stopRecordingProcess = function(callback){
    if(!callback) throw "Callback is not defined."

    worker.onmessage = function(event){
      callback(event.data.blob)
      garbageCollector()
    }

    stopRecordingProcess()
  }

  return self;
}(Microphone,window))

// EXAMPLE
// function moduleDidLoad() {
//   var startBtn = document.getElementById('start')
//   startBtn.onclick = function(){
//     Microphone.startRecordingProcess()
//   }
//   var stopBtn = document.getElementById('stop')
//   stopBtn.onclick = function(){
//     Microphone.stopRecordingProcess(function(event){
//       fileSystem.save("microphone.wav", event.data.blob)
//       console.log("Success")
//     })
//   }
// }
