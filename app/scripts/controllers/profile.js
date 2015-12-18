'use strict';

/**
 * @ngdoc function
 * @name digitalclassApp.controller:ProfileCtrl
 * @description
 * # ProfileCtrl
 * Controller of the digitalclassApp
 */
angular.module('digitalclassApp')
  .controller('ProfileCtrl', function ($cookieStore) {
    var self = this
    self.$this = $cookieStore.get('profile')
  });
