'use strict';

angular.module('contraceptionApp')
  .controller('MainCtrl', function ($scope, $http, Auth,$location,$state) {

    $scope.startServey = function(){

      if(Auth.isLoggedIn()){

        var user = Auth.getCurrentUser().$promise.then(function(user){

          var section = user.currentSection
          if(section == undefined)
            $location.url('/questions/intro/1')
          else{
            $state.go('sections.questions', {type:'question',id:section})
          }


        })
      }
      else
        $location.url('/signup')

    }

  });
