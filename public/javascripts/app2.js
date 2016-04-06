
/*angular.module('comment', [])
.controller('MainCtrl', [
  '$scope',
  function($scope){
    $scope.test = 'Hello world!';
  }
]);*/
angular.module('MyApp',['ngMaterial', 'ngMessages', 'material.svgAssetsCache', 'ngCookies', 'moment-picker'])

.controller('AppCtrl', function($scope, $mdDialog, $mdMedia, $cookies) {
    $scope.status = '  ';
	  $scope.task1_showing = true;
    $scope.tasks = [
         {title: 'Walk Dog', dueDate: '3/25/2016', category: 'home', description:     'Bring doggy bags'},
         {title: 'Due Homework', dueDate: '3/25/2016', category: 'home', description:                   'Bring doggy bags'},
         {title: 'Attended meeting', dueDate: '3/25/2016', category: 'home', description: 'Bring doggy bags'},
         {title: 'visit TAs', dueDate: '3/25/2016', category: 'home', description: 'Bring doggy bags'}
    ];
	
	angular.element(document).ready(function () {
		//$cookies.put('last_page', 'fiveday_view.html');
		$scope.myLink = $cookies.get('prev_page');
		var str = String(window.location);
		var url_ending = str.substring(str.length - 9)
   
		console.log(url_ending);
		if (url_ending != 'menu.html' && url_ending != 'port.html' && url_ending != 'tats.html')
		{
       // Setting a cookie
  		 $cookies.put('prev_page', window.location);
		
		   var prev_page = $cookies.get('prev_page');
		   console.log(prev_page);
		}
	});
	
	//$scope.test = function() {
       // console.log('Made it here');
       // document.getElementById('task1').style.color = 'red';   
   // }
   
	  $scope.getTasks = function() {
		    return $http.get('/getDueTasks').success(function(data){
			     angular.copy(data, $scope.tasks);
		  });
	  };
	
	$scope.startTask = function() {
		document.getElementById('task1').style.display = 'none'; 
        document.getElementById('task2').style.display = 'none';  
	    document.getElementById('task3').style.display = 'none'; 
		document.getElementById('task4').style.display = 'none'; 
		document.getElementById('doing_task').style.display = 'inherit'; 
    }
	
	$scope.pauseTask = function() {
        //console.log('Made it here');
		document.getElementById('task1').style.display = 'inherit'; 
        document.getElementById('task2').style.display = 'inherit';  
	    document.getElementById('task3').style.display = 'inherit'; 
		document.getElementById('task4').style.display = 'inherit'; 
		document.getElementById('doing_task').style.display = 'none'; 
    }
	
	$scope.completeTask = function(ev) {
		//change this code to actually complete tasks
        //console.log('Made it here');
		document.getElementById('task1').style.display = 'inherit'; 
        document.getElementById('task2').style.display = 'inherit';  
	    document.getElementById('task3').style.display = 'inherit'; 
		document.getElementById('task4').style.display = 'inherit'; 
		document.getElementById('doing_task').style.display = 'none'; 
    }
	
	$scope.toggleTasks = function(ev) {
		if ($scope.task1_showing)
		{
			document.getElementById('task1_head').innerText = 'Task Two'; 
			document.getElementById('task1_p').innerText = 'Do your reading';  
			document.getElementById('task1_duedate').innerText = 'Due today at 9:00 AM';  
		}
		else
		{
			document.getElementById('task1_head').innerText = 'Task One'; 
			document.getElementById('task1_p').innerText = 'Walk Fido';  
			document.getElementById('task1_duedate').innerText = 'Due today at 8:30 AM';  
		}
		
		$scope.task1_showing = !$scope.task1_showing;
		
	}
	
	$scope.goToSched = function(ev) {
		window.location = "day_view.html"
	}
	
	$scope.showConfirm = function(ev) {
    // Appending dialog to document.body to cover sidenav in docs app
		var confirm = $mdDialog.confirm()
          .title('Would you like to delete "Walk Fido"?')
          .textContent('This will permanently remove the task and will not mark it complete.')
          .ariaLabel('delete task')
          .targetEvent(ev)
          .ok('Do it!')
          .cancel('No way!');

			$mdDialog.show(confirm).then(function() {
				console.log('Put delete task code here');
				}, function() {
				//don't delete task
			});
	};
	
	$scope.showHelp = function(ev) {
		var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;

		$mdDialog.show({
		  controller: DialogController,
		  templateUrl: 'helpDialog.tmpl.html',
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
		
	}
	
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
    $scope.hide();
	  };
     
		$scope.create = function(task) {
	      return $http.post('/addTask', task).success(function(data){
        $scope.tasks.push(data);
	      });
    };
}


/**
Copyright 2016 Google Inc. All Rights Reserved. 
Use of this source code is governed by an MIT-style license that can be in foundin the LICENSE file at http://material.angularjs.org/license.
**/