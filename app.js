
var app = angular.module('main',['ui.bootstrap']);

app.service('pointService',function(){
  var points=0;
  var addPt=function(pts){
    points=points+pts;
  }
  var getPts=function(){
    return points;
  }
  return{
    addPt: addPt,
    getPts: getPts
  };
});

app.controller('mainCtrl',function($scope,$http,$modal,pointService){
  $scope.titlesOn=true;
  $scope.spellsOn=false;
  $scope.started=false;
  $scope.correct=false;
  $scope.points=pointService.getPts();

  //initially gets all static champion data.
  $http.get('https://na.api.pvp.net/api/lol/static-data/na/v1.2/champion?api_key=c388af0c-681a-431b-a5fb-b21dd04c7c0a').success(function(data){
    $scope.before=data.data;
    var result=[];
    //this loop converts the JSON data into an easier result array. 
    //initially, some variables on the returned data were the actual names of champions
    for(var i in $scope.before){
      result.push([i,$scope.before[i]]);
    }
    $scope.after=result;
  });

  //Switches the title and spell booleans
  $scope.switch=function(){
    $scope.titlesOn=!$scope.titlesOn
    $scope.spellsOn=!$scope.spellsOn
  }
  /*
  randomizes the spell and
  title by creating a random
  Number and getting the champion
  that has that index.
  */
  $scope.randomize=function(){
    $scope.globalScore=$scope.getGlobalScore();
    var random=Math.floor((Math.random()*123)+1)
    $scope.currentChampion=$scope.after[random];
    $scope.getRandomSpell();
  };
  /*
  the function that is called 
  when the start button is pressed.
  Initially gets th
  */
  $scope.start=function(){
    $scope.started=true;
    var random2=Math.floor((Math.random()*123)+1)
    $scope.currentChampion=$scope.after[random2];
    $scope.getRandomSpell();


  };
  $scope.check=function(toCheck,key,id){
    if(toCheck.toLowerCase()==key.toLowerCase()){
      $scope.correct=true;
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

      pointService.addPt(1);
      $scope.points=pointService.getPts();


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

      pointService.addPt(-1)
      $scope.points=pointService.getPts();
      $scope.addToGlobalScore(-1);
      $scope.globalScore=$scope.getGlobalScore();

    }
  };

  $scope.getGlobalScore=function(){
    //GET request to set the globalScore to the one on the nodejs backend.
    $http.get('http://10.0.0.24:8081/api/globalscore').success(function(data){
      $scope.globalScore=data.score;
    });
  };

  $scope.addToGlobalScore=function(add){
    //PUT request to a locally ran backend
    $http.put('http://10.0.0.24:8081/api/globalscore/'+add).success(function(data){
    })
  };
  /*
  executes an http GET request 
  to get the spells of all champions,
  randomizes a champion and spell.
  */
  $scope.getRandomSpell=function(){
    $http.get('https://na.api.pvp.net/api/lol/static-data/na/v1.2/champion?champData=spells&api_key=c388af0c-681a-431b-a5fb-b21dd04c7c0a').success(function(data){
      $scope.beforeSpell=data.data;
      var resultSpell=[];
      for(var i in $scope.beforeSpell){
        resultSpell.push([i,$scope.beforeSpell[i]]);
      }
      $scope.afterSpell=resultSpell;
      var random3=Math.floor((Math.random()*123)+1)
      //each champion has 4 spells
      var random4=Math.floor((Math.random()*4)+1)
      $scope.test=$scope.afterSpell[random3][1].spells[random4].name;
      $scope.spellChampName=$scope.afterSpell[random3][1].name

    })
  };
  //opens the modal for leaderboard, changes controller to rankCtrl
  $scope.openLeaderboard=function(){
    var modalInstance = $modal.open({
      templateUrl: 'partials/leaderboard.html',
      controller: 'rankCtrl'
    });
    
  };


});

app.controller('rankCtrl',function($scope,$modalInstance,$http,pointService){
  $scope.getPoints=function(){
    $scope.points=pointService.getPts();
  }
  $scope.getLeaders=function(){
    $http.get('http://10.0.0.24:8081/api/leaders').success(function(data){
      $scope.leaders=data;
  })
  }

  $scope.getLeaders();

  $scope.addToLeaderboard=function(name){
    $http.put('http://10.0.0.24:8081/api/leaders/'+name+'/'+pointService.getPts()).success(function(data){
      $scope.getLeaders();
    })
  }
  $scope.ok=function(){
    $modalInstance.close();
  };

  
    
  



})

