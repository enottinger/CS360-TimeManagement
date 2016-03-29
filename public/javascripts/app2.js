
/*angular.module('comment', [])
.controller('MainCtrl', [
  '$scope',
  function($scope){
    $scope.test = 'Hello world!';
  }
]);*/
angular.module('MyApp',['ngMaterial', 'ngMessages', 'material.svgAssetsCache'])

.controller('AppCtrl', function($scope, $mdDialog, $mdMedia) {
    $scope.status = '  ';

    $scope.showAdvanced = function(ev) {
		var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;

		$mdDialog.show({
		  controller: DialogController,
		  templateUrl: 'dialog1.tmpl.html',
		  parent: angular.element(document.body),
		  targetEvent: ev,
		  clickOutsideToClose:true,
		  fullscreen: useFullScreen
		})
		.then(function(answer) {
		  $scope.status = 'You said the information was "' + answer + '".';
		}, function() {
		  $scope.status = 'You cancelled the dialog.';
		});

		$scope.$watch(function() {
		  return $mdMedia('xs') || $mdMedia('sm');
		}, function(wantsFullScreen) {
		  $scope.customFullscreen = (wantsFullScreen === false);
		});
	};

});

function DialogController($scope, $mdDialog, $http) {
  $scope.hide = function() {
    $mdDialog.hide();
  };

  $scope.cancel = function() {
    $mdDialog.cancel();
  };

  $scope.answer = function(answer) {
    $mdDialog.hide(answer);
  };
	$scope.addTask = function(ev) {
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
		$scope.create = function(task) {
	  return $http.post('/addTask', task).success(function(data){
	     $scope.tasks.push(data);
	  });
    };

	$scope.getTasks = function() {
		return $http.get('/userTasks').success(function(data){
			 angular.copy(data, $scope.tasks);
		});
	};
	$scope.tasks = [
         {title: 'Walk Dog', dueDate: '3/25/2016'},
         {title: 'Due Homework', dueDate: '3/25/2016'},
         {title: 'Attended meeting', dueDate: '3/25/2016'},
         {title: 'visit TAs', dueDate: '3/25/2016'},
         {title: 'Code', dueDate: '3/25/2016'}
    ];
}


/**
Copyright 2016 Google Inc. All Rights Reserved. 
Use of this source code is governed by an MIT-style license that can be in foundin the LICENSE file at http://material.angularjs.org/license.
**/