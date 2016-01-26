'use strict';

/**
 * @ngdoc service
 * @name digitalclassApp.auth
 * @description
 * # auth
 * Factory in the digitalclassApp.
 */
angular.module('digitalclassApp')
  .factory('Auth', function ($rootScope,$http,$cookieStore,$cookies,Profile,site) {
    var Auth = ( function(){
      var SERVER = site.url // for development
      var self = {}

      self.isAuthorized = function(){
        var profile = $.cookie('profile')
        if(profile != undefined || profile != null){
          if("credentials" in profile){
            setProfile(profile)
          }
          return true
        }

        return false
      }

      self.create_credential = function(model,callback,fail){
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
        $http(options).success(callback).error(fail || onHttpFail)
      }

      self.destroy_credential = function(callback){
        setTimeout(clearProfile,200)
        if(callback) setTimeout(callback,600)
      }

      function setProfile(profile){
        Profile.data = profile
        $rootScope.$profile = Profile.data
        return true
      }

      function onHttpFail(error){
        console.log(error)
      }

      function clearProfile(){
        // Remove Cache
        $.removeCookie("profile")
        // Clear Angular Objects
        window.Profile = null
        $rootScope.$profile = null
      }

      return self
    }(Auth,window))

    return Auth
  });
