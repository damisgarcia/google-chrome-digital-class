'use strict'

var Uploader = (function(){
  var SERVER = "http://127.0.0.1:3000"
  var API = "/api/v1"

  var self = {}

  self.situation = undefined

  self.status = {
    SUCCESS: 200,
    DONE: 201,
    INCOMPLETE: 303,
    FAIL: 500
  }

  self.readFile = function(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true)
    xhr.responseType = 'blob'

    xhr.onload = function(e) {
      if (this.status == 200) {
        self.situation = self.status.DONE
        callback(this.response)
      }
    }

    self.situation = self.status.INCOMPLETE
    xhr.send()
  }

  self.sendFile = function(options,callback){
    self.situation = self.status.INCOMPLETE
    // Build Form
    var formData = new FormData();
    formData.append('file', blobToFile(options.name, options.file))
    formData.append('tag_list', options.tags)
    formData.append('type', options.privilege)
    formData.append('access_token', options.token)

    var path = SERVER + API + "/repositories/lesson/"+options.lesson_id+"/media/"+options.type+"/chrome_extension"
    var xhr = new XMLHttpRequest()
    xhr.open('POST', path, true)

    xhr.onload = function(e) {
      self.situation = self.status.DONE
      callback(this.response)
    }

    xhr.send(formData)
  }

  function blobToFile(fileName, blob){
    blob.lastModifiedDate = new Date()
    blob.name = fileName
    return blob
  }

  return self
}(Uploader))
