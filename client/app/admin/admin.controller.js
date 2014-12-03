'use strict';

angular.module('contraceptionApp')
  .controller('AdminCtrl', function ($scope, $http, Auth, User) {

    // Use the User $resource to fetch all users
    $scope.users = User.query();

    $scope.sections={
      1:{completed:0,q:{},abandonded:0},
      2:{completed:0,q:{},abandonded:0},
      3:{completed:0,q:{},abandonded:0},
      4:{completed:0,q:{},abandonded:0},
      5:{completed:0,q:{},abandonded:0},
      6:{completed:0,q:{},abandonded:0},
      7:{completed:0,q:{},abandonded:0},
    }

    $scope.users.$promise.then(function(){
      angular.forEach($scope.users, function(u, i) {

        //didn't start
        if(!u.currentSection){
          u.currentSection = 1
          u.currentQuestion = 'q1'
        }

        for(var i=1;i<=7;i++){
          if(i<u.currentSection){
            $scope.sections[i].completed++
          }
          else if(i==u.currentSection){
            $scope.sections[i].abandonded++
            if($scope.sections[i].q[u.currentQuestion])
              $scope.sections[i].q[u.currentQuestion].number++
            else{
              $scope.sections[i].q[u.currentQuestion]={}
              $scope.sections[i].q[u.currentQuestion].number=1
            }
          }
        }
      });

      for(var s in $scope.sections){
        $scope.sections[s].cpercent = Math.round( $scope.sections[s].completed/$scope.users.length * 100) + "%" 
        $scope.sections[s].apercent = Math.round( $scope.sections[s].abandonded/$scope.users.length * 100) + "%" 
        
        for(var q in $scope.sections[s].q){
          $scope.sections[s].q[q].percent = Math.round($scope.sections[s].q[q].number/$scope.sections[s].abandonded * 100) + '%'
        }

      }
    })

    $scope.delete = function(user) {
      User.remove({ id: user._id });
      angular.forEach($scope.users, function(u, i) {
        if (u === user) {
          $scope.users.splice(i, 1);
        }
      });
    };
  });
