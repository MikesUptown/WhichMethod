'use strict';

angular.module('contraceptionApp')
  .controller('MainCtrl', function ($scope, $http, Auth,$location) {

    $scope.startServey = function(){

      if(Auth.isLoggedIn())
        $location.url('/questions/intro/1')
      else
        $location.url('/signup')




    }

  });
