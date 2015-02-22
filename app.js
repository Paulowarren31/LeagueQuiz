//We inject 'ui.bootstrap' to allow us to use modals.
var app = angular.module('main',['ui.bootstrap']);

/*
This is the service that allows the local
user's points to be passed between the 
main controller and the modal controller
*/
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
//we inject pointservice to be able to get the points that a user has.
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
  initially gets a random champion and passes it to 
  $scope.currentChampion
  */
  $scope.start=function(){
    $scope.started=true;
    var random2=Math.floor((Math.random()*123)+1)
    $scope.currentChampion=$scope.after[random2];
    $scope.getRandomSpell();
  };

  /*
  This is the function that checks if the answer was right.
  converts both to lowercase, checks if they are equal.
  If they are, alert with correct and add one to global score
  and local score. 

  The id parameter specifies if what we are checking is a champion
  title, or a champion spell. 
  */
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
      pointService.addPt(1);
      $scope.addToGlobalScore(1);
      $scope.getGlobalScore();
      $scope.points=pointService.getPts();
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
      $scope.addToGlobalScore(-1);
      $scope.getGlobalScore();
      $scope.points=pointService.getPts();
      
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
      controller: 'leaderCtrl'
    });
  };


});

app.controller('leaderCtrl',function($scope,$modalInstance,$http,pointService){
  //grabs the points the user has from the point service.
  $scope.getPoints=function(){
    $scope.points=pointService.getPts();
  }
  //HTTP GET request to the node server to get the leaders
  $scope.getLeaders=function(){
    $http.get('http://10.0.0.24:8081/api/leaders').success(function(data){
      $scope.leaders=data;
  })
  }
  //this just gets all leaders when the controller is initialized
  $scope.getLeaders();
  //HTTP PUT request to add a user to the leaderboard.
  $scope.addToLeaderboard=function(name){
    $http.put('http://10.0.0.24:8081/api/leaders/'+name+'/'+pointService.getPts()).success(function(data){
      $scope.getLeaders();
    })
  }
  //this is the close button for the modal.
  $scope.ok=function(){
    $modalInstance.close();
  };

  
    
  



})

