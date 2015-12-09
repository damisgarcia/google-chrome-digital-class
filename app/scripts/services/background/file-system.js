'use strict';

/**
 * @ngdoc service
 * @name digitalclassApp.fileSystem
 * @description
 * # fileSystem
 * Factory in the digitalclassApp.
 */

 var fileSystem = (function(){
   var self = {}

   self.$1MB =  1024
   self.$10MB = self.$1MB * self.$1MB
   self.$1GB =  self.$10MB * self.$1MB
   self.$2GB =  self.$10MB * (self.$1MB * 2 )
   self.$5GB =  self.$10MB * ( self.$1MB * 5 )

   self.basename = "filesystem:" + location.origin + "/persistent"


   self.list = function(callback){
     navigator.webkitPersistentStorage.requestQuota(self.$1GB, function() {
       window.webkitRequestFileSystem(window.PERSISTENT , self.$1GB, function(persistent){
         self.$list(persistent,callback)
       })
     })
   }

   self.find_by_name = function(filename,callback){
     if(!callback) throw "Error: Not found return function"
     navigator.webkitPersistentStorage.requestQuota(self.$1GB, function() {
       window.webkitRequestFileSystem(window.PERSISTENT , self.$1GB, function(persistent){
         self.$find_by_name(persistent,filename,callback)
       })
     })
   }

   self.save = function(filename,blob){
     navigator.webkitPersistentStorage.requestQuota(self.$1GB, function() {
       window.webkitRequestFileSystem(window.PERSISTENT , self.$1GB, function(persistent){
         self.$save(persistent,filename,blob)
       })
     })
   }

   self.destroy = function(file,callback){
     file.remove(callback,self.$errorHandler)
   }

   //  private
   self.$find_by_name = function(repository,filename,callback){
     repository.root.getFile(filename, {create: false}, function(DatFile) {
       callback(DatFile)
     })
   }

   self.$save = function(repository,filename,blob){
     repository.root.getFile(filename, {create: true}, function(DatFile) {
       DatFile.createWriter(function(DatContent) {
         DatContent.write(blob)
       })
     })
   }

   self.$list = function(repository,callback){
    if(!callback) throw "Error: Not found return function"
    var dirReader = repository.root.createReader();
    var entries = [];
    dirReader.readEntries (function(results) {
      results.forEach(function(file){
        file.extensionPath = self.basename + file.fullPath
        file.$name = file.name
      })
      callback(results)
    })
   }

   self.$errorHandler = function(error){
     console.debug(error)
   }

   return self
 }(fileSystem))
