var app = angular.module('main', []);
app.controller('mainCtrl',['$scope','$http',function($scope,$http){
  $scope.test="before";
  $http.get('https://na.api.pvp.net/api/lol/static-data/na/v1.2/champion?api_key=c388af0c-681a-431b-a5fb-b21dd04c7c0a').success(function(data){
    $scope.champions=data.champions;
  })
}]);
