var mongoose = require('mongoose');
var URLSlugs = require('mongoose-url-slugs');
var passportLocalMongoose = require('passport-local-mongoose');

// User
// * our site requires authentication.
// * so users have a username and password
// * they also have an identity.
var User = new mongoose.Schema({
	// username and password are provided by plugin
	name: String,
	identity: {type: String},
	username: String,
	password: String
});
User.plugin(passportLocalMongoose);

// Problem
// * our site stores problems created by coach
// * each problem contains an id, a title, a description
// * each problem has test input and test output
// * each problem has hardness
var Problem = new mongoose.Schema({
	problem_id: {type:String, require:true}, // Problem Code
	title: {type:String, require:true},
	author: {type:String, require:true},
	hardness: {type:Number, require:true}
});

// Submission
// * each submission has a problem associated with it
// * each submission has a feedback
// * each submission has a submission time
var Submission = new mongoose.Schema({
	submission_id: Number, // Submission Number
	problem: {type:mongoose.Schema.Types.ObjectId, ref:'Problem'},
});

User.plugin(URLSlugs('username'));
Problem.plugin(URLSlugs('problem_id'));
Submission.plugin(URLSlugs('submission_id'));
mongoose.model('User',User);
mongoose.model('Problem',Problem);
mongoose.model('Submission',Submission);

mongoose.connect('mongodb://localhost/final');