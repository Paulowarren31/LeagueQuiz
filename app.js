var app = angular.module('main', []);
app.controller('mainCtrl',['$scope',function($scope){
	$scope.tests=[{name:'paulo'},{name:'warren'}];
}]);
