// @autor: Damis Garcia

'use strict'

importScripts('/app/scripts/services/lib/Uploader.js');

self.onmessage = function(event) {
  var data = event.data;
  switch (data.command) {
    case 'start':
      Uploader.readFile(data.filePath, function(file) {
        data.options.file = file
        Uploader.sendFile(data.options,function(data){
          self.postMessage({status:Uploader.situation, response: data})
        })
      });
      break
    case 'situation':
      self.postMessage({status:Uploader.situation})
      break
  }
};
