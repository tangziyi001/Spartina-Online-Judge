var request = require('request');

function testCom(){
		request({
			url: 'https://api.compilers.sphere-engine.com/api/v3/test',
			method: 'GET',
			qs:{
				access_token:'14e498d49275c2d7a5bb04cd89de82fe7a76bab1'
			}
		}, function(err,response, body){
			console.log(response.statusCode);
			console.log(body);
	});
}
function testPro(){
		request({
			rejectUnauthorized:false,
			url: 'https://72e460c4.problems.sphere-engine.com/api/v3/test',
			method: 'GET',
			header:{
				'Content-Type': 'application/json'
			},
			qs:{
				access_token:'14e498d49275c2d7a5bb04cd89de82fe7a76bab1'
			}
		}, function(err,response, body){
			console.log(err);
			console.log(response.statusCode);
			console.log(body);
		});
}


// List languages: returns object
function listLang(callback){
	request.get({
			url: 'https://api.compilers.sphere-engine.com/api/v3/languages',
			qs:{
				access_token:'af547f9885290485d2e8a2dc579de3d0'
			}
		}, function(err,response, body){
			console.log(response.statusCode);
			console.log(body);
	});
}
// Submit Code: callback an id
function submitCode(mylanguage, mysourceCode, myinput, callback){
	request.post({
			url: 'https://api.compilers.sphere-engine.com/api/v3/submissions',
			qs:{
				access_token:'af547f9885290485d2e8a2dc579de3d0'
			},
			form:{
				sourceCode: mysourceCode,
				language: mylanguage,
				input: myinput
			}
		}, function(err,response, body){
			if(err) console.log("ERR SUBMIT");
			console.log(response.statusCode);
			var id = JSON.parse(body).id;
			console.log(id);
			if(callback)
				callback(id);
	});
}
// Check Status: callback an object of status
function checkStatus(myid, callback){
	request.get({
			url: 'https://api.compilers.sphere-engine.com/api/v3/submissions/'+myid,
			qs:{
				access_token:'af547f9885290485d2e8a2dc579de3d0',
				id:myid,
				withSource:true,
				withInput:true,
				withOutput:true,
				witStderr: true,
				withCmpinfo: true
			}
		}, function(err,response, body){
			if(err) console.log("ERR STATUS");
			console.log(response.statusCode);
			var info = JSON.parse(body);
			console.log(info);
			if(callback)
				callback(info);
	});
}
testPro();
// var testCode = "#include <stdio.h> \n int main(){ printf(\"Hello!\"); return 0; }";

// submitCode(44, testCode, "1", function(id){ // 44 is C++
// 	checkStatus(45086761);
// });



