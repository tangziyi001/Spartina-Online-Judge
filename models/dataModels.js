var mongoose = require('mongoose');
var URLSlugs = require('mongoose-url-slugs');
var passportLocalMongoose = require('passport-local-mongoose');


// Problem
// * our site stores problems created by coach
// * each problem contains an id, a title, a description
// * each problem has test input and test output
// * each problem has hardness
var Problem = new mongoose.Schema({
	problem_id: {type:String, require:true}, // Problem Code
	title: {type:String, require:true},
	author: {type:String, require:true},
	hardness: {type:Number, require:true},
	problem_description: {type:String},
	input_description: {type:String},
	output_description: {type:String},
	sample_input: {type:String},
	sample_output: {type:String},
});


// User
// * our site requires authentication.
// * so users have a username and password
// * they also have an identity.
var User = new mongoose.Schema({
	// username and password are provided by plugin
	name: {type:String,required:true},
	// Username and password are provided by Passport
	// username: {type:String,required:true},
	// password: {type:String,required:true},
	problem_created: [Problem],//[{type:mongoose.Schema.Types.ObjectId, ref:'Problem'}],
	problem_solved: [Problem],//[{type:mongoose.Schema.Types.ObjectId, ref:'Problem'}]
});
User.plugin(passportLocalMongoose);



// Submission
// * each submission has a problem associated with it
// * each submission has a feedback
// * each submission has a submission time
var Submission = new mongoose.Schema({
	submission_id: Number, // Submission Number
	problem: String,//{type:mongoose.Schema.Types.ObjectId, ref:'Problem'},
	user: String
});

User.plugin(URLSlugs('username'));
Problem.plugin(URLSlugs('problem_id'));
Submission.plugin(URLSlugs('submission_id'));
mongoose.model('User',User);
mongoose.model('Problem',Problem);
mongoose.model('Submission',Submission);

var c = require('../credential.js');
mongoose.connect(c.mongo);

