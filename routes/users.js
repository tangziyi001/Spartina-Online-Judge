var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var passport = require('passport');

var Problem = mongoose.model('Problem');
var User = mongoose.model('User');
/* GET users listing. */


router.get('/', function(req, res, next){
	var context = {problems: [], user:req.user};
	Problem.find({}, function(err, probs, count){
		probs.forEach(function(ele){
			console.log(ele);
			context.problems.push(ele);
		});
		res.render('user', context);
	});
});
router.post('/', function(req,res,next){
	console.log('HH');
	new Problem({
		problem_id: req.body.problem_id,
		title: req.body.problem_title,
		author: req.user.username,
		hardness: req.body.hardness
	}).save(function(err,prob,count){
		if(err) console.log(err);
		else
			console.log(prob);
		res.redirect('/');
	});
});

// Passport Register
router.get('/register', function(req, res) {
    res.render('register', {});
});

router.post('/register', function(req, res) {
    User.register(new User({ username : req.body.username , name: req.body.nick, identity: req.body.type}), req.body.password, function(err, account) {
        if (err) {
            return res.render('register', { err : "Register Failed" });
        }
        passport.authenticate('local')(req, res, function () {
            res.redirect('/users');
        });
    });
});

// Passport Login
router.get('/login', function(req,res,next){
	console.log(req.user);
	res.render('login', { user : req.user });
});
router.post('/login', passport.authenticate('local'), function(req, res) {
    res.redirect('/users');
});
router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/users');
});


module.exports = router;
