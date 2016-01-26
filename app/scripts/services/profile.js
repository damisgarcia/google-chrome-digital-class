'use strict';

/**
 * @ngdoc service
 * @name digitalclassApp.profile
 * @description
 * # profile
 * Factory in the digitalclassApp.
 */

angular.module('digitalclassApp')
  .factory('Profile', function ($http,$window,$rootScope,site) {
    var Profile = (function(){
      var SERVER = site.url // for development
      var API = "/api/v1"

      var self = {}

      self.getProfile = function(token,callback,fail){
        var path = SERVER + API + "/users/profile?access_token=" + token.access_token
        $http.get(path).success(callback).error(fail || onFail)
      }

      function onFail(error){
        // Remove Cache
        $.removeCookie("profile")
        // Clear Angular Objects
        window.Profile = null
        $rootScope.$profile = null
      }

      return self
    }(Profile, window))

    if(!window.Profile){
      window.Profile = Profile
    }

    return window.Profile
  });
