'use strict';

/**
 * @ngdoc service
 * @name digitalclassApp.auth
 * @description
 * # auth
 * Factory in the digitalclassApp.
 */
angular.module('digitalclassApp')
  .factory('Auth', function ($rootScope,$http,$cookieStore,$cookies,Profile) {
    var Auth = ( function(){
      var SERVER = "http://127.0.0.1" // for development
      var self = {}

      self.isAuthorized = function(){
        var profile = $.cookie('profile')        
        if(profile != undefined || profile != null){
          var credentials = profile.credentials

          Profile.getProfile(profile.credentials,function(data){
            profile = data
            profile.credentials = credentials

            Profile.data = profile
            $rootScope.$profile = Profile.data
            $.cookie('profile', profile)
          })
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
