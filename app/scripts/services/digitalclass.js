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

  self.filesystem = "filesystem:" + location.origin + "/persistent/"

  self.status = {
    done:       0,
    recording:  1,
    paused:     2,
    success:    3,
    fail:       4
  }

  self.situation = self.status.done

  self.popup = null
  self.popupOptions = {
    type:"popup",
    width: 320,
    height: 240,
    top: window.screen.availHeight,
    left: window.screen.availWidth
  }

  self.camStream = null
  self.desktopStream = null
  self.micStream = null

  self.$closeTab = function(id){
    chrome.windows.remove(id, null)
  }

  self.$generateFileName = function(){
    var basename = new Date().toLocaleString().replace(/ /g,'_')
    basename = basename.replace(/[\/:]/g,'-')
    return basename
  }

  return self
}(DigitalClass))
