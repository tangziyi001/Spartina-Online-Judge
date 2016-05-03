var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var Problem = mongoose.model('Problem');
var User = mongoose.model('User');
var Submission = mongoose.model('Submission');
var sp = require('../sphereEngine.js')


/* GET home page. */

router.get('/', function(req, res, next) {
	res.render('index');
});
router.get('/problems', function(req, res, next){
	var context = {problems: []};
	Problem.find({}, function(err, probs, count){
		probs.forEach(function(ele){
			//console.log(ele);
			context.problems.push(ele);
		});
		res.render('problems', context);
	});
});
router.get('/problems/:id', function(req,res,next){
	var theid = req.params.id;
	Problem.findOne({_id: theid}, function(err, prob, next){
		sp.listLang(function(body){
			var obj = JSON.parse(body);
			res.render('prob', {prob:prob, user:req.user, compilers:obj});
		});
		
	});
});
router.post('/problems/submit',function(req,res,next){
	var problem_id = req.body.problem_id;
	var code = req.body.submit_code;
	console.log(problem_id);
	console.log(code);
});
router.get('/problems/:id/testCases', function(req, res, next){
	Problem.findOne({_id: req.params.id}, function(err, prob, next){
		if(err) res.send('TEST CASES DISPLAY ERROR');
		if(!req.user || req.user.username != prob.author)
			res.send("Only problem creator can manage test cases for this problem. If you are the problem creator, please login.");
		var num = prob.test_case_number;
		console.log("Number of test cases is: "+num);
		var context = {problem_id:prob.problem_id, problem_title: prob.title, test_cases:[]};
			sp.showAllCases(prob.problem_id, function(body){
				// Obj is a list of test cases for this problem
				var cases = JSON.parse(body).testcases;
				console.log("Total cases: "+cases.length);
				console.log(cases);
				// List all test cases
				cases.forEach(function(item){
					var ele = {
					num: item.number,
					input: item.input.url,
					output: item.output.url,
					};
					context.test_cases.push(ele);
				});
				res.render('testCases', context);	
			});
	});	
});

// Create test case
router.post('/problems/:id/testCases', function(req,res,next){
	Problem.findOne({_id: req.params.id}, function(err,prob,next){
		if(err) res.send('TEST CASES ADD ERROR');
		else if(!req.user || req.user.username != prob.author)
			res.send("Only problem creator can manage test cases for this problem. If you are the problem creator, please login.");
		else if(!req.body.input || !req.body.output){
			res.send("You cannot leave input/output blank");
		}
		else{
			//req.session.testCaseMsg = null;
			// Submit to the Sphere Engine
			sp.createTestCases(req.body.problem_id, req.body.input, req.body.output, function(body){
				console.log(body);
				res.redirect('/problems/'+req.params.id+'/testCases');
			});
		}
	});
});

// Open test case file
router.get('/problems/:problem_id/testCases/:num/:io',function(req,res,next){
	Problem.findOne({problem_id: req.params.problem_id}, function(err,prob,next){
		if(err) res.send('TEST CASES ADD ERROR');
		if(!req.user || req.user.username != prob.author)
			res.send("Only problem creator can manage test cases for this problem. If you are the problem creator, please login.");
		sp.showTestCase(req.params.problem_id, req.params.num, function(body){
			var obj = JSON.parse(body);
			if(req.params.io == 'input'){
				res.redirect(obj.input.url+'?access_token='+sp.my_access_token);
			}
			else if(req.params.io == 'output'){
				res.redirect(obj.output.url+'?access_token='+sp.my_access_token);
			}
			// else
			// 	res.send('ERROR');
		});
	});
});

// Submit Code Ajax
router.post('/api/problems/submit',function(req, res, next){
	console.log("Submission: "+req.body.problem_id);
	console.log(req.body.code);
	console.log(decodeURIComponent(req.body.language));
	sp.submitSolution(req.body.problem_id, req.body.language, req.body.code, function(submission_id){
		console.log("Submission Id is "+submission_id);
			console.log('Submit Success');
			// Return the submission id
			var obj = JSON.parse(submission_id);
			console.log(obj.submissionId);
			res.json({submission_id: obj.submissionId});
	});
});

// Submission Status Track
router.get('/api/problems/track', function(req,res,next){
	var submission_id = req.query.submission_id;
	sp.submissionStatus(submission_id, function(body){
		var obj = JSON.parse(body);
		console.log("Submission Status from backend "+obj.result.status_code);
		switch(obj.result.status_code){
			case 1:
				res.json({'result':'Compiling',message:'The program is being compiled', color:'blue'});
				break;
			case 3:
				res.json({'result':'Running',message:'The program is running', color:'blue'});
				break;
			case 11:
				storeSubmission(obj, function(){
					res.json({'result': 'Compilation Error', 
						message: 'The program could not be executed due to compilation error',
						color:'purple'});
				});
				break;
			case 12:
				storeSubmission(obj, function(){
					res.json({'result': 'Runtime Error', 
					message: 'The program finished because of the runtime error, for example: division by zero, array index out of bounds, uncaught exception',
					color:'red'});
				});
				break;
			case 13:
				storeSubmission(obj, function(){
					res.json({'result': 'Time Limit Exceeded ', 
					message: 'The program didn\'t stop before the time limit',
					color:'brown'});
				});
				break;
			case 14:
				storeSubmission(obj, function(){
					res.json({'result': 'Wrong Answer', 
					message: 'Program did not solve the problem',
					color:'red'});
				});
				break;
			case 15:
				storeSubmission(obj, function(){
					// Successful Submission: add to user's solved list
					Problem.findOne({problem_id: obj.problem.code}, function(err,prob,next){
						// Find repeated ones
						var existed = 0;
						for(var i = 0; i < req.user.problem_solved.length; i++){
							var tmp = req.user.problem_solved[i];
							if(req.user.problem_solved[i].problem_id == obj.problem.code){
								existed = 1;
								break;
							}
						}
						if(existed){
							res.json({'result': 'Accepted', 
							message: 'Congratulations! You\'ve solved this problem',
							color:'green'});
						}
						else{
							User.update({slug:req.user.slug}, {$push:{'problem_solved': prob}},  {safe: true, upsert: true}, function(err, u){
								res.json({'result': 'Accepted', 
								message: 'Congratulations! You\'ve solved this problem',
								color:'green'});
							});
						}
					});
				});
				
				break;
			default:
				res.json({'result':'running', color:'blue'});
		}

	});
	// Store a submission
	function storeSubmission(obj, callback){
		var re;
		if(obj.result.status_code == 11)
			re = 'Compilation Error';
		if(obj.result.status_code == 12)
			re = 'Runtime Error';
		if(obj.result.status_code == 13)
			re = 'Time Limit Exceeded';
		if(obj.result.status_code == 14)
			re = 'Wrong Answer';
		if(obj.result.status_code == 15)
			re = 'Accepted';
		new Submission({
			submission_id: obj.id,
			problem: obj.problem.code,
			user: req.user.username,
			result:re
		}).save(function(err){
			if(err) console.log("ERR SAVE SUBMISSION " + err);
			else{
				callback();
			}
		});
	}
});
router.get('/submissions', function(req,res,next){
	var selector = {};
	console.log(req.query.filter);
	if(req.query.filter)
		selector.problem = req.query.filter;
	Submission.find(selector, function(err, submissions, count){
		res.render('submissions', {submissions: submissions});
	});
});

module.exports = router;
