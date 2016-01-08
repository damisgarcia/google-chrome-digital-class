'use strict';

/**
 * @ngdoc function
 * @name digitalclassApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the digitalclassApp
 */
angular.module('digitalclassApp')
  .controller('LoginCtrl', function ($cookieStore,$state,$timeout,Auth) {
    var self = this

    if($.cookie('profile')) $state.go("profile")

    this.sigin = function(e){
      e.preventDefault()

      var creadentials = { email: this.email, password: this.password }

      self.error = null

      Auth.create_credential(creadentials,function(token){
        Profile.getProfile(token,function(user){
          user.credentials = token
          $.cookie('profile',user)
          $timeout(renableSubmit,600)
        },function(error){
          self.error = error
          $timeout(renableSubmit,600)
        })
      },function(error){
        self.error = error
        $timeout(renableSubmit,600)
      })
      self.process = true
    }

    function renableSubmit(){
      self.process = false
      if(!self.error) $state.go("profile")
    }
    $.cookie('state', $state.current.name)
  });
