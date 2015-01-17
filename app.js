
var app = angular.module('main', []);
app.controller('mainCtrl',['$scope','$http',function($scope,$http){
$scope.champions=[];
$scope.started=false; $http.get('https://na.api.pvp.net/api/lol/static-data/na/v1.2/champion?api_key=c388af0c-681a-431b-a5fb-b21dd04c7c0a').success(function(data){
    $scope.before=data.data;
    var result=[];
    for(var i in $scope.before){
      result.push([i,$scope.before[i]]);
    }
    $scope.after=result;
    });
  $scope.randomize=function(){
    var random=Math.floor((Math.random()*123)+1)
    $scope.currentChampion=$scope.after[random];
  };

  $scope.start=function(){
    $scope.started=true;
    var random2=Math.floor((Math.random()*123)+1)
    $scope.currentChampion=$scope.after[random2];

  };
  $scope.check=function(toCheck){
    if(toC)
  };
}]);
