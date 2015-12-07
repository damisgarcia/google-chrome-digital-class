'use strict';

/**
 * @ngdoc function
 * @name digitalclassApp.controller:WebcamCtrl
 * @description
 * # WebcamCtrl
 * Controller of the digitalclassApp
 */
angular.module('digitalclassApp')
  .controller('WebcamCtrl', function (getUserMedia) {
    getUserMedia.getWebCam(function(stream){

    })
  });
