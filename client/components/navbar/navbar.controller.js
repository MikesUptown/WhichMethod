'use strict';

angular.module('contraceptionApp')
  .controller('NavbarCtrl', function ($scope, $location, Auth, $rootScope, $state, $cookies) {
    $scope.menu = [{
      'title': 'WhichMethod Logo',
      // 'link': '/'
    }];


      

    $scope.setLanguage = function(lang){
      $rootScope.language = lang;
      $cookies.put('lang', lang);
    }


    $scope.startServey = function(){

      if(Auth.isLoggedIn()){

        var user = Auth.getCurrentUser().$promise.then(function(user){

          var section = user.currentSection
          if(section == undefined || section==0)
            $location.url('/questions/intro/0')
          else{
            $state.go('sections.questions', {type:'question',id:section})
          }


        })
      }
      else
        $location.url('/signup')
    }



    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;

    $scope.logout = function() {
      Auth.logout();
      $location.path('/login');
    };

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });