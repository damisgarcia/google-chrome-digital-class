'use strict';

/**
 * @ngdoc service
 * @name digitalclassApp.auth
 * @description
 * # auth
 * Factory in the digitalclassApp.
 */
angular.module('digitalclassApp')
  .factory('Auth', function ($http) {
    var Auth = ( function(){
      var SERVER = "http://127.0.0.1" // for development
      var self = {}

      self.create_credential = function(model,callback){
        var body = {
          email: model.email,
          password: model.password,
          "grant_type":"password"
        }

        var options = {
          url: SERVER + "/oauth/token",
          method: "POST",
          data: body,
          "Content-Type":"application/json"
        }
        $http(options).success(callback).error(onHttpFail)
      }

      function onHttpFail(error){
        console.log(error)
      }

      return self
    }(Auth,window))

    return Auth
  });
