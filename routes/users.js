var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();


var Problem = mongoose.model('Problem');
/* GET users listing. */

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/coach', function(req, res, next){
	var context = {problems: []};
	Problem.find({}, function(err, probs, count){
		probs.forEach(function(ele){
			console.log(ele);
			context.problems.push(ele);
		})
	});
	res.render('coach', context);
});
router.post('/coach', function(req,res,next){
	console.log('HH');
	new Problem({
		problem_id: req.body.problem_id,
		title: req.body.problem_title,
		author: 'coach',
		hardness: req.body.hardness
	}).save(function(err,prob,count){
		if(err) console.log(err);
		else
			console.log(prob);
		res.redirect('/users/coach');
	});
});

module.exports = router;
