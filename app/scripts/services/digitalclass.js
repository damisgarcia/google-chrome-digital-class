'use strict';

/**
 * @ngdoc service
 * @name digitalclassApp.getUserMedia
 * @description
 * # getUserMedia
 * Factory in the digitalclassApp.background
 */
var DigitalClass = (function(){
  var self = {}

  self.status = {
    paused:     0,
    recording:  1,
    processing: 2,
    processed:  3,
    canceled:   4,
    success:    5,
    failed:     6,
    done:       7
}
  self.situation = self.status.paused

  return self
}(DigitalClass))
