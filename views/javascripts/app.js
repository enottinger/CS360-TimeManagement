angular.module('tasklist', [])
.controller('MainCtrl', [
  '$scope','$http',
   function($scope,$http){
      $scope.test = 'Hello world';
      $scope.tasks = [];
      $scope.create = function(task) {
	  return $http.post('/addTask', task).success(function(data){
	     $scope.tasks.push(data);
	  });
      };
      $scope.addTask = function() {
          if($scope.titleContent === ''){return;}
          if($scope.dateContent === ''){return;}
	  console.log("In addTask with "+$scope.titleContent+ " " + $scope.dateContent);
	  $scope.create({
             title: $scope.titleContent,
             dueDate: $scope.dateContent,
          });
          $scope.titleContent = '';
          $scope.dateContent = '';
      };
      $scope.getTasks = function() {
          console.log("in getTasks");
	  return $http.get('/getTasks').success(function(data){
             angular.copy(data, $scope.tasks);
          });
      };
      $scope.getStyle = function(length, index) {
          console.log("in getStyle");
	  var jitter1;
          var jitter2;
	  var opt = index % 4;
	  if(opt == 0){
	     jitter1 = 150;
             jitter2 = 100;
          }
          else if(opt == 1){
	     jitter1 = 170;
             jitter2 = 120;
          }
          else if(opt == 2){
	     jitter1 = 145;
             jitter2 = 125;
          }
          else if(opt == 3){
	     jitter1 = 130;
             jitter2 = 80;
          }
          var zInd = length - index;
	  /*var style = "{position: relative; top: "+jitter+"; left: "+jitter+"; z-index: "+zInd+";}";*/
	  var style = { position: "absolute", top: jitter1, left: jitter2, zIndex: zInd, width: "70%", height: "70%"};
          return style;
      };
    }
]);