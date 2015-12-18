'use strict';

/**
 * @ngdoc function
 * @name digitalclassApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the digitalclassApp
 */
angular.module('digitalclassApp')
  .controller('LoginCtrl', function ($cookieStore,$state,$timeout,Auth,Profile) {
    var self = this

    if($cookieStore.get('profile')) $state.go("profile")

    this.sigin = function(e){
      e.preventDefault()
      var creadentials = { email: this.email, password: this.password }
      Auth.create_credential(creadentials,function(token){
        Profile.getProfile(token,function(user){
          user.credentials = token
          $cookieStore.put('profile',user)
          $timeout(renableSubmit,600)
        })
      })
      self.process = true
    }

    function renableSubmit(){
      self.process = false
    }

    $cookieStore.put('state', $state.current.name)
  });
