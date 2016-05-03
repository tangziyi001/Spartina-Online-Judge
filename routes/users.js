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
	if(req.user.problem_solved)
		context.solved = req.user.problem_solved.length;
	console.log("user page");
	console.log(req.user);
	if(req.user) req.session.message = null;
	res.render('user', context);
});
router.post('/', function(req,res,next){
	console.log(req.body.problem_description);
	// The problem is created via Sphere Engine
	sp.createProblem(req.body.problem_id, req.body.problem_title, function(back){
		console.log("Message from Sphere Engine: "+back);
		if(back == 400){
			res.send('Problem ID has already existed');
		}
		else{
			// Add problem to the database
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
					// The problem is added to the user's problem created list
					User.update({slug:req.user.slug}, {$push:{'problem_created': np}},  {safe: true, upsert: true}, function(err, u){
						res.redirect('/users');
					});
				}
			});
		}
	});
});

// Passport Register
router.get('/register', function(req, res) {
	console.log(req.session.message);
    res.render('register', {message:req.session.message});
});

router.post('/register', function(req, res) {
	console.log("register");
	console.log(req.body);
    User.register(new User({ username : req.body.username , name: req.body.nick}), req.body.password, function(err, account) {
        if (err) {
        	console.log(err);
        	req.session.message = err.message;
        	console.log(err.message);
            res.redirect('/users/register');
        }
        else{
	        passport.authenticate('local')(req, res, function () {
	        	req.session.message=null;
	            res.redirect('/users');
	        }); 
    	}	
    });
});

// Passport Login
router.get('/login', function(req,res,next){
	//console.log(typeof req.flash('error')[0]);
	res.render('login', {err_message:req.flash('error')[0]} );
});
router.post('/login',
		passport.authenticate('local', 
		{ successRedirect: '/users', failureRedirect: '/users/login', 
		 failureFlash: 'Invalid username or password.'})
);

router.get('/logout', function(req, res) {
	req.flash('logout','You are logout.');
    req.logout();
    res.redirect('/users');
});


module.exports = router;
