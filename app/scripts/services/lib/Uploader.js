'use strict'

var Uploader = (function(){
  var SERVER = "http://www.digitalclass.lme.ufc.br:3000"
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
    var xhr = new XMLHttpRequest()
    xhr.open('GET', url, true)
    xhr.responseType = 'blob'

    xhr.onload = function(e) {
      if(this.status === self.status.SUCCESS) {
        callback(this.response)
        self.situation = self.status.DONE
      }
    }

    self.situation = self.status.INCOMPLETE
    xhr.send()
  }

  self.sendFile = function(options,callback){
    self.situation = self.status.INCOMPLETE
    // Build Form
    var formData = new FormData();
    var file = blobToFile(options.name, options.file)
    formData.append('file', file)
    formData.append('filename', options.parent)
    formData.append('tag_list', options.tags)
    formData.append('type', options.type)
    formData.append('privacy', options.privacy)
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
    blob.filename = fileName
    return blob
  }

  return self
}(Uploader))
