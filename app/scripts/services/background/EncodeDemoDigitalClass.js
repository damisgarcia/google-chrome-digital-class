'use strict'

var microphone,audioContext
var BUFFER_SIZE = 16384
var QUALITY =  0.4
var KBPS    = 128

// Get Media User
navigator.getUserMedia({ audio: true },
  function(stream) {
    microphone = audioContext.createMediaStreamSource(stream);
  },
  function(error) {
    $microphone[0].checked = false;
  });


  // recording process
  var worker = new Worker('js/EncoderWorker.js'),
      encoder = undefined;        // used on encodingProcess == direct

  worker.onmessage = function(event) { saveRecording(event.data.blob); };

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
    if (encodingProcess === 'direct') {
      encoder = new OggVorbisEncoder(audioContext.sampleRate, 2, quality);
      processor.onaudioprocess = function(event) {
        encoder.encode(getBuffers(event));
      };
    } else {
      worker.postMessage({
        command: 'start',
        process: encodingProcess,
        sampleRate: audioContext.sampleRate,
        numChannels: 2,
        quality: quality
      });
      processor.onaudioprocess = function(event) {
        worker.postMessage({ command: 'record', buffers: getBuffers(event) });
      };
    }
  }
