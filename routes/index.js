var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');

/* GET home page. */
router.get('/user', function(req, res, next) {
 	User.find(function(err, users) {
	 	res.json(users);
	});
});

router.get('/', function(req, res, next) {
	res.sendFile('login.html', { root: 'public' });
});

module.exports = router;
