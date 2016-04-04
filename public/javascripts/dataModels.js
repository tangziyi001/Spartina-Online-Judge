var mongoose = require('mongoose');

// users
// * our site requires authentication.
// * so users have a username and password
// * they also have an identity.
var User = new mongoose.Schema({
	// username and password are provided by plugin
	identity: {type: String}
});

var Contest = new mongoose.Schema({
	id: {type:Number,required:true},
	list: 
});
