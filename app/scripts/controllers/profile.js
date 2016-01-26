'use strict';

/**
 * @ngdoc function
 * @name digitalclassApp.controller:ProfileCtrl
 * @description
 * # ProfileCtrl
 * Controller of the digitalclassApp
 */
angular.module('digitalclassApp')
  .controller('ProfileCtrl', function ($cookieStore,$stateParams,$state,Profile,Auth) {
    if($stateParams.logout) Auth.destroy_credential(function(){      
      $state.go("home")
    })
    this.obj = Profile
  });
