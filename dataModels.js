var mongoose = require('mongoose');

// User
// * our site requires authentication.
// * so users have a username and password
// * they also have an identity.
var User = new mongoose.Schema({
	// username and password are provided by plugin
	identity: {type: String}
});

// Problem
// * our site stores problems created by coach
// * each problem contains an id, a title, a description
// * each problem has test input and test output
// * each problem has hardness
var Problem = new mongoose.Schema({
	problem_id: Number,
	title: String,
	description: String,
	testinput: String,
	testOutput: String,
	hardness: Number
});

// Submission
// * each submission has a problem associated with it
// * each submission has a feedback
// * each submission has a submission time
var Submission = new mongoose.Schema({
	problem: {type:mongoose.Schema.Types.ObjectId, ref:'Problem'},
	feedback: String,
	submission_time: String,
	code: String
});



