var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var passport = require('passport');
var sp = require('../sphereEngine.js');
var Problem = mongoose.model('Problem');
var User = mongoose.model('User');
/* GET users listing. */


router.get('/', function(req, res, next){
	var context = {user:req.user, message: req.session.message};
	console.log("user page");
	console.log(req.user);
	res.render('user', context);
});
router.post('/', function(req,res,next){
	console.log(req.body.problem_description);
	var np = new Problem({
		problem_id: req.body.problem_id,
		title: req.body.problem_title,
		author: req.user.username,
		hardness: req.body.hardness,
		problem_description: req.body.problem_description,
		input_description: req.body.input_description,
		output_description: req.body.output_description,
		sample_input: req.body.sample_input,
		sample_output: req.body.sample_output,
	});
	np.save(function(err){
		if(err){
			res.send(err);
			console.log(err);
		}
		else{
			console.log(np);
			flag = 1;
			// The problem is created via Sphere Engine
			sp.createProblem(np.problem_id, np.title, function(back){
				console.log("Message from Sphere Engine: "+back);
				var obj = JSON.parse(back);
				if(obj.message === 'Problem code already used'){
					res.send('Problem ID has already existed');
					flag = 0;
				}
			});
			if(flag){
				// The problem is added to the user's problem created list
				User.update({slug:req.user.slug}, {$push:{'problem_created': np}},  {safe: true, upsert: true}, function(err, u){
					res.redirect('/users');
				});
			}
		}
	});
});

// Passport Register
router.get('/register', function(req, res) {
    res.render('register', {});
});

router.post('/register', function(req, res) {
	console.log("register");
	console.log(req.body);
    User.register(new User({ username : req.body.username , name: req.body.nick}), req.body.password, function(err, account) {
        if (err) {
        	console.log(err);
        	req.session.message='Registration Failed';
            return res.redirect('/users');
        }
        passport.authenticate('local')(req, res, function () {
        	req.session.message=null;
            res.redirect('/users');
        }); 
    });
});

// Passport Login
router.get('/login', function(req,res,next){
	//console.log(req.user);
	res.render('login', { user : req.user});
});
router.post('/login', passport.authenticate('local'), function(req, res) {
    res.redirect('/users');
});
router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/users');
});


module.exports = router;
