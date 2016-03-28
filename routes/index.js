/*var express = require('express');
var router = express.Router();

router.get('/user', function(req, res, next) {
 	User.find(function(err, users) {
	 	res.json(users);
	});
});

router.get('/', function(req, res, next) {
	res.sendFile('login.html', { root: 'public' });
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
    res.sendfile('views/info.html');
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
	   Task.find({'_id': {'$in' : user.tasklist}}, function(err, items) {
                    console.log("useritems ",user.tasklist); // <--Gets me array with the ids
                    console.log("items ", items); //<--Empty
                    res.send(items);//Empty
           });
	   //console.log(tasks);
	   //res.json(tasks);
 	});   
});

return router;
}