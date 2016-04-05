var mongoose = require('mongoose');

// User
// * our site requires authentication.
// * so users have a username and password
// * they also have an identity.
var User = new mongoose.Schema({
	// username and password are provided by plugin
	identity: {type: String}
});

// Member
// * each member has a handle, which is the username of vjudge
// * each member has a total score
// * each member has a list of contests he/she participated
var Member = new mongoose.Schema({
	handle:String,
	score: Number,
	contests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Contest' }]
});

// Contest
// * each contest has an id and a list of name-score pairs.
var Contest = new mongoose.Schema({
	id: {type:Number,required:true},
	list: [{name:String, score:Number}]
});

