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
   self.$10GB =  self.$5GB * 2

   self.basename = "filesystem:" + location.origin + "/persistent"

   //  File Api
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

   self.save = function(filename,blob,callback){
     navigator.webkitPersistentStorage.requestQuota(self.$1GB, function() {
       window.webkitRequestFileSystem(window.PERSISTENT , self.$1GB, function(persistent){
         self.$save(persistent,filename,blob, callback)
       })
     })
   }


   self.destroy = function(file,callback){
     file.remove(callback,self.$errorHandler)
   }

   //  private file
   self.$find_by_name = function(repository,filename,callback){
     repository.root.getFile(filename, {create: false}, function(DatFile) {
       self.$appendPublicAttributesToFile(DatFile)
       callback(DatFile)
     })
   }

   self.$save = function(repository,filename,blob,callback){
     repository.root.getFile(filename, {create: true}, function(DatFile) {
       DatFile.createWriter(function(DatContent) {
         DatContent.write(blob)
       })
       if(callback) callback()
     })
   }

  //  Directories API

  self.open = function(dirname,callback){
    navigator.webkitPersistentStorage.requestQuota(self.$1GB, function() {
      window.webkitRequestFileSystem(window.PERSISTENT , self.$1GB, function(persistent){
        self.$open(persistent,dirname,callback)
      })
    })
  }

   self.mkdir = function(dirname,callback){
     navigator.webkitPersistentStorage.requestQuota(self.$1GB, function() {
       window.webkitRequestFileSystem(window.PERSISTENT , self.$1GB, function(persistent){
         self.$mkdir(persistent,dirname,callback)
       })
     })
   }

   self.mvdir = function(dirname,newDirName,callback){
     if(!callback) throw "Error: Not found return function"
     navigator.webkitPersistentStorage.requestQuota(self.$1GB, function() {
       window.webkitRequestFileSystem(window.PERSISTENT , self.$1GB, function(persistent){
         self.$mvdir(persistent,dirname,newDirName,callback)
       })
     })
   }

   self.rmdir = function(dirname,callback){
     navigator.webkitPersistentStorage.requestQuota(self.$1GB, function() {
       window.webkitRequestFileSystem(window.PERSISTENT , self.$1GB, function(persistent){
         self.$rmdir(persistent,dirname,callback)
       })
     })
   }

  //  private directories

  self.$mkdir = function(repository,dirname,callback){
    repository.root.getDirectory(dirname, { create: true }, callback)
  }

  self.$rmdir = function(repository,dirname,callback){
    if(!callback) throw "Error: Not found return function"
    repository.root.getDirectory(dirname, { create: false }, function(repository){
      repository.removeRecursively(callback,function(error){
        console.error(error)
      })
    })
  }

  self.$mvdir = function(repository,dirname,newDirName,callback){
    repository.root.getDirectory(dirname, { create: false }, function(dir){
      dir.moveTo(repository.root,newDirName,callback,function(error){
        console.error(error)
      })
    })
  }

  self.$open = function(repository,dirname,callback){
    repository.root.getDirectory(dirname, { create: false }, function(repository){
      self.$list(repository,callback)
    })
  }

   //  Common Methods

   // List all archives from root
   self.$list = function(repository,callback){
    if(!callback) throw "Error: Not found return function"
    var root = repository.root || repository
    var dirReader = root.createReader()
    var entries = []

    var readEntries = function() {
       dirReader.readEntries (function(results) {
        if (!results.length) {
          callback(entries.reverse())
        } else {
          results.forEach(function(file){
            self.$appendPublicAttributesToFile(file)
          })
          entries = entries.concat(self.$toArray(results))
          readEntries()
        }
      }, function(error){
        console.log(error)
      })
    };

    readEntries()
   }

   self.$appendPublicAttributesToFile = function(file){
     file.extensionPath = self.basename + file.fullPath
     file.$name = file.name
   }

   self.$toArray = function(list) {
    return Array.prototype.slice.call(list || [], 0);
  }

   self.$errorHandler = function(error){
     console.debug(error)
   }

   return self
 }(fileSystem,window))


// DOC => Examples

// fileSystem.save("hello_world.txt",new Blob(["Hello World"],{type:"text/plain"}))
// fileSystem.mkdir("november_rain/",function(repositories){
//   console.log("Created")
// })
// fileSystem.rmdir("november_rain/",function(repositories){
//   console.log("Destroy")
// })
// fileSystem.open("hello_world/",callback)
// fileSystem.list(function(repositories){
//   console.log(repositories)
// })
// Find
// fileSystem.find_by_name("08-12-2015_17-29-20_desktop.webm",function(f){
//   console.log(f.root)
// })
//
// // Destroy
// fileSystem.find_by_name("hello_world.txt",function(f){
//   fileSystem.destroy(f,function(){
//     console.log("File Destroy")
//   })
// })
