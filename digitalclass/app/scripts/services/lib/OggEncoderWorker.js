// manually rewritten from CoffeeScript output
// (see dev-coffee branch for original source)

self.OggVorbisEncoderConfig = {
  memoryInitializerPrefixURL: "/app/scripts/services/lib/"
  // => changed to javascripts/memory/OggVorbisEncoder.min.js.mem
};

importScripts('/app/scripts/services/lib/OggVorbisEncoder.min.js');

var buffers = undefined,
    encoder = undefined;

self.onmessage = function(event) {
  var data = event.data;
  switch (data.command) {
    case 'start':
      encoder = new OggVorbisEncoder(data.sampleRate, data.numChannels,
                                     data.quality);
      buffers = data.process === 'separate' ? [] : undefined;
      break;
    case 'record':
      encoder.encode(data.buffers);
      break;
    case 'finish':
      if (buffers != null)
        try{
          self.postMessage({ blob: encoder.finish() });
        }
        catch (e){          
          console.warn(e)
        }
      encoder = undefined;
      break;
    case 'cancel':
      encoder.cancel();
      encoder = undefined;
  }
};
