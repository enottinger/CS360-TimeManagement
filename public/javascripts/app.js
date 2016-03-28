angular.module('tasklist', [])
.controller('MainCtrl', [
  '$scope','$http',
   function($scope,$http){
      $scope.test = 'Hello world';
      $scope.tasks = [
         {title: 'Walk Dog', dueDate: '3/25/2016'},
         {title: 'Due Homework', dueDate: '3/25/2016'},
         {title: 'Attended meeting', dueDate: '3/25/2016'},
         {title: 'visit TAs', dueDate: '3/25/2016'},
         {title: 'Code', dueDate: '3/25/2016'}
      ];
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
          return $http.get('/userTasks').success(function(data){
             angular.copy(data, $scope.tasks);
          });
      };
      
    }
]);