var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var Problem = mongoose.model('Problem');
/* GET home page. */

router.get('/', function(req, res, next) {
	res.render('index');
});
router.get('/problems', function(req, res, next){
	var context = {problems: []};
	Problem.find({}, function(err, probs, count){
		probs.forEach(function(ele){
			console.log(ele);
			context.problems.push(ele);
		});
		res.render('problems', context);
	});
});

module.exports = router;
