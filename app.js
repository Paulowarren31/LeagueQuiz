
var app = angular.module('main', []);
app.controller('mainCtrl',['$scope','$http',function($scope,$http){
  $scope.champions=[];
  $scope.started=false;
  $scope.correct=false;
  $scope.firstSolved=false;
  $scope.points=0;
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
    $scope.globalScore=$scope.getGlobalScore();
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
  $scope.check=function(toCheck,key,id){

    console.log(toCheck+" "+key)
    if(toCheck==key){
      $scope.correct=true;
      $scope.firstSolved=true;
      if(id==1){
        window.alert('CORRECT! You get a point.')
        $scope.randomize();
        $scope.answer=""

      }
      else{
        window.alert('CORRECT! You get a point.')
        $scope.getRandomSpell();
        $scope.answerSpell=""
      }

      $scope.addToGlobalScore(1);
      $scope.points=$scope.points+1;
      $scope.globalScore=$scope.getGlobalScore();

    }
    else{
      $scope.correct=false;
      if(id==2){
        window.alert('NO! IT WAS '+$scope.spellChampName);
        $scope.getRandomSpell();
        $scope.answerSpell=""
      }
      else{
        window.alert('NO! IT WAS '+$scope.currentChampion[1].name);
        $scope.randomize();
        $scope.answer=""
      }

      $scope.points=$scope.points-1;
      $scope.addToGlobalScore(-1);
      $scope.globalScore=$scope.getGlobalScore();

    }
  };

  $scope.getGlobalScore=function(){
    //GET request to set the globalScore to the one on the nodejs backend.
    $http.get('http://localhost:8080/api/globalscore').success(function(data){
      $scope.globalScore=data.score;
    });
  };

  $scope.addToGlobalScore=function(add){
    //PUT request to a locally ran backend
    $http.put('http://localhost:8080/api/globalscore/'+add).success(function(data){
      console.log('added '+add+' to globalscore')
    })
  };
  $scope.rmToGlobalScore=function(sub){
    $http.put('http://localhost:8080/api/globalscore/rm/'+sub);
  }

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
