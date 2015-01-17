
var app = angular.module('main', []);
app.controller('mainCtrl',['$scope','$http',function($scope,$http){
  $scope.points=0;
  $scope.globalScore;
  $scope.champions=[];
  $scope.started=false;
  $scope.correct=false;
  $scope.spellChampName="";
  $scope.firstSolved=false;
  //initially gets all static champion data.
  $http.get('https://na.api.pvp.net/api/lol/static-data/na/v1.2/champion?api_key=c388af0c-681a-431b-a5fb-b21dd04c7c0a').success(function(data){
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
    $scope.getRandomSpell();
  };

  $scope.start=function(){
    $scope.getGlobalScore();
    $scope.started=true;
    var random2=Math.floor((Math.random()*123)+1)
    $scope.currentChampion=$scope.after[random2];
    $scope.getRandomSpell();


  };
  $scope.check=function(toCheck,key){
    console.log(toCheck+" "+key)
    if(toCheck==key){
      $scope.correct=true;
      window.alert('CORRECT! You get a point.')
      $scope.firstSolved=true;
      $scope.points=$scope.points+1;
      $scope.randomize();
      $scope.getRandomSpell();
      $scope.answer=""
      $scope.answerSpell=""
    }
    else{
      $scope.correct=false;
      window.alert('NO! IT WAS '+$scope.spellChampName);
      $scope.randomize();
      $scope.getRandomSpell();
      $scope.answer=""
      $scope.answerSpell=""
    }
  };

  $scope.getGlobalScore=function(){
    $http.get('http://localhost:8080/api/globalscore').success(function(data){
      $scope.globalScore=data.score;
    });
  };

  $scope.addToGlobalScore=function(add){
    $http.put('http://localhost:8080/api/globalscore/'+add).success(function(data){
      console.log('added '+add+' to globalscore')
    })
  };
  $scope.getRandomSpell=function(){
    $http.get('https://na.api.pvp.net/api/lol/static-data/na/v1.2/champion?champData=spells&api_key=c388af0c-681a-431b-a5fb-b21dd04c7c0a').success(function(data){
      $scope.beforeSpell=data.data;
      var resultSpell=[];
      for(var i in $scope.beforeSpell){
        resultSpell.push([i,$scope.beforeSpell[i]]);
      }
      $scope.afterSpell=resultSpell;
      var random3=Math.floor((Math.random()*123)+1)
      var random4=Math.floor((Math.random()*4)+1)
      $scope.test=$scope.afterSpell[random3][1].spells[random4].name;
      $scope.spellChampName=$scope.afterSpell[random3][1].name

    })
  };


}]);
