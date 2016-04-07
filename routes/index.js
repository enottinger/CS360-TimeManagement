/*var express = require('express');
var router = express.Router();

router.get('/user', function(req, res, next) {
 	User.find(function(err, users) {
	 	res.json(users);
	});
});

router.get('/', function(req, res, next) {
	res.sendFile('views/login.html', { root: 'public' });
});

module.exports = router;
*/

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Task = mongoose.model('Task');


var isLoggedin = function (req, res, next) {
if (req.isAuthenticated())
    return next();
res.sendfile('views/login.html');
}

module.exports = function(passport){

/* GET login page. */
router.get('/', isLoggedin, function(req, res){
    res.sendfile('views/tinder_suggestion.html');
});

/* Handle Login POST */
router.post('/login', passport.authenticate('login', {
    successRedirect: '/',
    failureRedirect: '/'
}));

/* GET Registration Page */
router.get('/signup', function(req, res){
    res.sendfile('views/signup.html');
});

router.get('/login', function(req, res){
    res.sendfile('views/login.html');
});

router.get('/tinder_suggestion.html', isLoggedin, function(req, res){
    res.sendfile('views/tinder_suggestion.html');
});

router.get('/stats.html',isLoggedin, function(req, res){
    res.sendfile('views/stats.html');
});

router.get('/month_view.html', isLoggedin, function(req, res){
    res.sendfile('views/month_view.html');
});

router.get('/import.html', isLoggedin, function(req, res){
    res.sendfile('views/import.html');
});

router.get('/home.html', isLoggedin, function(req, res){
    res.sendfile('views/home.html');
});

router.get('/fiveday_view.html', isLoggedin, function(req, res){
    res.sendfile('views/fiveday_view.html');
});

router.get('/day_view.html', isLoggedin, function(req, res){
    res.sendfile('views/day_view.html');
});

router.get('/dailytasks.html', isLoggedin, function(req, res){
    res.sendfile('views/dailytasks.html');
});

router.get('/menu.html', isLoggedin, function(req, res){
    res.sendfile('views/menu.html');
});

/* Handle Registration POST */
router.post('/signup', passport.authenticate('signup', {
    successRedirect: '/',
    failureRedirect: '/signup'
}));

/* Handle Logout */
router.get('/signout', function(req, res) {
    req.logout();
    res.redirect('/');
});

router.get('/users', function(req, res, next) {
    User.find(function(err, users){
       if(err){ return next(err); }
       res.json(users);
    });
});

router.get('/user', isLoggedin, function(req, res, next) {
    User.findById(req.session.passport.user,function (err, user) { 
	   if(err) {return next(err); }
	   res.json(user);
 	});   
	
});

router.param('user', function(req, res, next, id) {
    var query = User.findById(id);
    query.exec(function (err, user){
       if(err) {return next(err); }
       if(!user) { return next(new Error("can't find user")); }
       req.user = user;
       return next();
    });
});

router.get('/user/:user', function(req, res) {
    res.json(req.user);
});

router.get('/tasks', function(req, res, next) {
    Task.find(function(err, tasks){
       if(err){ return next(err); }
       res.json(tasks);
    });
});

router.param('task', function(req, res, next, id) {
    var query = Task.findById(id);
    query.exec(function (err, task){
       if(err) {return next(err); }
       if(!task) { return next(new Error("can't find task")); }
       req.task = task;
       return next();
    });
});

router.get('/task/:task', function(req, res) {
    res.json(req.task);
});

router.put('/task/:task/completed', function(req, res, next) {
    console.log("in completed");
    req.task.completed(function(err, task){
       if(err) {return next(err); }
       res.json(task);
    });
});

router.put('/task/:task/uncompleted', function(req, res, next) {
    req.task.uncompleted(function(err, task){
       if(err) {return next(err); }
       res.json(task);
    });
});

router.put('/task/:task/delete', function(req, res, next) {
    req.task.delete(function(err, task){
       if(err) {return next(err); }
       res.json(task);
    });
});

router.put('/task/:task/addTime', function(req, res, next) {
    req.task.completed(req.body, function(err, task){
       if(err) {return next(err); }
       res.json(task);
    });
});

router.put('/task/:task/setPriority', function(req, res, next) {
    req.task.completed(req.body, function(err, task){
       if(err) {return next(err); }
       res.json(task);
    });
});

router.put('/task/:task/active', function(req, res, next) {
    req.task.setActive(function(err, task){
       if(err) {return next(err); }
       res.json(task);
    });
});

router.put('/task/:task/inactive', function(req, res, next) {
    req.task.setInactive(function(err, task){
       if(err) {return next(err); }
       res.json(task);
    });
});

router.post('/addTask', isLoggedin, function(req, res, next) {
    var task = new Task(req.body);
    User.findByIdAndUpdate(
       req.session.passport.user,
       {$push: {tasklist: task}},
       {safe: true, upsert: true},
       function(err, model) {
           console.log(err);
       }
    );
    console.log("Task: "+task);
    task.save(function(err, task){
    if(err){ return next(err); }
    res.json(task);
    });
});

router.get('/getTasks', isLoggedin, function(req, res, next) {
        User.findById(req.session.passport.user,function (err, user) { 
	   if(err) {return next(err); }
	   var tasks = [];
	   Task.find({'_id': {'$in' : user.tasklist}, "complete": false, "deleted": false}, function(err, items) {
                    console.log("useritems ",user.tasklist); // <--Gets me array with the ids
                    console.log("items ", items); //<--Empty
                    res.send(items);//Empty
           });
	   //console.log(tasks);
	   //res.json(tasks);
 	});   
});

router.get('/getDeletedTasks', isLoggedin, function(req, res, next) {
        User.findById(req.session.passport.user,function (err, user) { 
	   if(err) {return next(err); }
	   var tasks = [];
	   Task.find({'_id': {'$in' : user.tasklist}, completed: false, deleted: true}, function(err, items) {
                    console.log("useritems ",user.tasklist); // <--Gets me array with the ids
                    console.log("items ", items); //<--Empty
                    res.send(items);//Empty
           });
	   //console.log(tasks);
	   //res.json(tasks);
 	});   
});

router.get('/getCompletedTasks', isLoggedin, function(req, res, next) {
        User.findById(req.session.passport.user,function (err, user) { 
	   if(err) {return next(err); }
	   var tasks = [];
	   Task.find({'_id': {'$in' : user.tasklist}, completed: false, deleted: false}, function(err, items) {
                    console.log("useritems ",user.tasklist); // <--Gets me array with the ids
                    console.log("items ", items); //<--Empty
                    res.send(items);//Empty
           });
	   //console.log(tasks);
	   //res.json(tasks);
 	});   
});

router.get('/getTodayTasks', isLoggedin, function(req, res, next) {
        User.findById(req.session.passport.user,function (err, user) { 
	   if(err) {return next(err); }
	   var now = new Date();
	   var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
	   console.log(today);
	   var tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate()+1);
	   Task.find({'_id': {'$in' : user.tasklist}, "complete": false, "deleted": false, "dueDate":{$lte: tomorrow, $gte: today}}, function(err, items) {
                    console.log("useritems ",user.tasklist);
                    console.log("items ", items);
		    var tasks = [];
                    res.send(items);
           });
	   //console.log(tasks);
	   //res.json(tasks);
 	});   
});

router.get('/getDueTasks', isLoggedin, function(req, res, next) {
        User.findById(req.session.passport.user,function (err, user) { 
	   if(err) {return next(err); }
	   Task.find({'_id': {'$in' : user.tasklist}, "complete": false, "deleted": false}, function(err, items) {
                    console.log("useritems ",user.tasklist);
                    console.log("items ", items);
		    var tasks = [];
                    for(var i = 0; i < items.length; i++){
			
			//console.log("Dates: " + items[i].dueDate.toDateString() + "+++" + (new Date).toDateString());
	  	        if(items[i].dueDate != undefined && items[i].dueDate.toDateString() == (new Date).toDateString() || items[i].dueDate <= (new Date)){
	 	           tasks.push(items[i]);
                        }
		    }
                    res.send(tasks);
           });
	   //console.log(tasks);
	   //res.json(tasks);
 	});  
});

router.get('/getFiveDayTasks', isLoggedin, function(req, res, next) {
        User.findById(req.session.passport.user,function (err, user) { 
	   if(err) {return next(err); }
	   var today = new Date();
	   var fiveDaysFuture = new Date().setDate(today.getDate()+5);
	   Task.find({'_id': {'$in' : user.tasklist}, "complete": false, "deleted": false, "dueDate":{$lte: fiveDaysFuture, $gte: today}}, function(err, items) {
                    console.log("useritems ",user.tasklist);
                    console.log("items ", items);
                    res.send(items);
           });
	   //console.log(tasks);
	   //res.json(tasks);
 	});  
});

return router;
}