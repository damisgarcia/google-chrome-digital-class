'use strict';

/**
 * @ngdoc service
 * @name digitalclassApp.profile
 * @description
 * # profile
 * Factory in the digitalclassApp.
 */
angular.module('digitalclassApp')
  .factory('Profile', function ($http) {
    var Profile = (function(){
      var SERVER = "http://127.0.0.1" // for development
      var API = "/api/v1"

      var self = {}

      self.getProfile = function(token,callback){
        var path = SERVER + API + "/users/profile?access_token=" + token.access_token
        $http.get(path).success(callback).error(onFail)
      }

      function onFail(error){
        console.log(error)
      }

      return self
    }(Profile))

    return Profile
  });
