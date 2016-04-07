
/*angular.module('comment', [])
.controller('MainCtrl', [
  '$scope',
  function($scope){
    $scope.test = 'Hello world!';
  }
]);*/
angular.module('MyApp',['ngMaterial', 'ngMessages', 'material.svgAssetsCache', 'ngCookies', 'moment-picker', 'ngAnimate'])

.controller('AppCtrl', function($scope, $mdDialog, $mdMedia, $cookies, $timeout, $http) {
    
    $scope.status = '  ';
    $scope.tasks = [];
    
    $scope.lastTaskIndex = 3;
	
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
       //hide the cards unless the user actually has that many tasks
      
     
    if (url_ending == '217:3009/')
    { 
      $scope.getTasks();           
    }
    
    
	});
	
	//$scope.test = function() {
       // console.log('Made it here');
       // document.getElementById('task1').style.color = 'red';   
   // }
   
	  $scope.getTasks = function() {
		    return $http.get('/getTasks').success(function(data){
			     angular.copy(data, $scope.tasks);
           $scope.showCardsInit();
		  });
	  };
     
     $scope.showCardsInit = function() {
           document.getElementById('task0').style.zIndex = 4;
           document.getElementById('task1').style.zIndex = 3;
           document.getElementById('task2').style.zIndex = 2;
           document.getElementById('task3').style.zIndex = 1;
          for (var i = 0; i < 4; i++)
         {
             //hide the cards unless the user actually has that many tasks
            document.getElementById('task' + i).style.overflow = 'hidden';
            document.getElementById('task' + i).style.visibility = 'hidden';
             
         }
         for (var i = 0; i < $scope.tasks.length; i++)
         {    
             if (i == 4)
               break;//we only show four cards at a time
               
             document.getElementById('task' + i).style.visibility = 'visible';
             var current_task = $scope.tasks[i];
             document.getElementById('task' + i + '_head').innerText = current_task.title; 
             document.getElementById('task' + i + '_p').innerText = current_task.description;  
             document.getElementById('task' + i + '_duedate').innerText = 'Due today at ' + current_task.dueDate;  
             $scope.lastTaskIndex = i;  
         }
     
     }
     $scope.showCards = function() {
                
         for (var i = 0; i < $scope.tasks.length; i++)
         {    
             if (i == 4)
               break;//we only show four cards at a time
            // var current_task = $scope.tasks[(i + $scope.currentTaskIndex) % $scope.tasks.length];
    	       var current_card = document.getElementById('task' + i);
             current_card.style.display = 'inherit';
             if (current_card.style.zIndex == 4)
             {
                 if ($scope.lastTaskIndex == $scope.tasks.length - 1)
                   $scope.lastTaskIndex = 0;
                 else
                   $scope.lastTaskIndex += 1;
                 current_card.style.zIndex = 1;
                 var next_task = $scope.tasks[$scope.lastTaskIndex];
                 document.getElementById('task' + i + '_head').innerText = next_task.title; 
                 document.getElementById('task' + i + '_p').innerText = next_task.description;  
                 document.getElementById('task' + i + '_duedate').innerText = 'Due today at ' + next_task.dueDate; 
             }
             else
             {
                current_card.style.zIndex = parseInt(current_card.style.zIndex) + 1;                 
             }    
         }
     
     }
	
	$scope.startTask = function() {
		document.getElementById('tasks_container').style.display = 'none'; 
    //    document.getElementById('task1').style.display = 'none';  
	   // document.getElementById('task2').style.display = 'none'; 
		//document.getElementById('task3').style.display = 'none'; 
		document.getElementById('in_progress').style.display = 'inherit'; 
    }
	
	$scope.pauseTask = function() {
        //console.log('Made it here');
		document.getElementById('in_progress').style.display = 'none';
    document.getElementById('tasks_container').style.display = 'inherit';  
    }
	
	$scope.completeTask = function(ev) {
		//change this code to actually complete tasks
        //console.log('Made it here');
		  document.getElementById('in_progress').style.display = 'none'; 
        document.getElementById('tasks_container').style.display = 'inherit'; 
    }
	
	$scope.toggleTasks = function(ev) {
    $timeout(function(){$scope.showCards();}, 500);
    	
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
      locals: {
          tasks: $scope.tasks
      },
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
      locals: {
          tasks: $scope.tasks
      },
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
 
   DialogController.$inject = ['$scope','$mdDialog', '$http', 'tasks'];
   function DialogController($scope, $mdDialog, $http, tasks) {
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
      console.log(tasks);
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
         tasks.push(data);
	      });
    };
  }

});




/**
Copyright 2016 Google Inc. All Rights Reserved. 
Use of this source code is governed by an MIT-style license that can be in foundin the LICENSE file at http://material.angularjs.org/license.
**/