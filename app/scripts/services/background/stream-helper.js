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

  return self
})(StreamHelper)
