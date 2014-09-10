'use strict'

angular.module 'whichmethodApp'
.controller 'NavbarCtrl', ($scope, $location, Auth) ->
  $scope.menu = [
     title: 'WhichMethod' 
    link: '/' 
  ] 
  $scope.isCollapsed = true
  $scope.isLoggedIn = Auth.isLoggedIn
  $scope.isAdmin = Auth.isAdmin
  $scope.getCurrentUser = Auth.getCurrentUser

  $scope.logout = ->
    Auth.logout()
    $location.path '/login'

  $scope.isActive = (route) ->
    route is $location.path()