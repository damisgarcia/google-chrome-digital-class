'use strict';

/**
 * @ngdoc service
 * @name digitalclassApp.Stream
 * @description
 * # getUserMedia
 * Factory in the digitalclassApp.
 */

var StreamHelper = (function(){
  var self = {}

  self.to_url = function(stream){
    try {
      return URL.createObjectURL(stream)
    } catch (e) {  return null  }
  }

  self.b64toBlob = function(b64Data, contentType, sliceSize) {
      contentType = contentType || '';
      sliceSize = sliceSize || 512;

      var byteCharacters = atob(b64Data);
      var byteArrays = [];

      for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
          var slice = byteCharacters.slice(offset, offset + sliceSize);

          var byteNumbers = new Array(slice.length);
          for (var i = 0; i < slice.length; i++) {
              byteNumbers[i] = slice.charCodeAt(i);
          }

          var byteArray = new Uint8Array(byteNumbers);

          byteArrays.push(byteArray);
      }

      var blob = new Blob(byteArrays, {type: contentType});
      return blob;
  }

  return self
})(StreamHelper)
