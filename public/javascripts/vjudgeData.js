var request = require('request');
var htmlparser = require('htmlparser2');

function addData(contestID, callback){
	var handler = new htmlparser.DomHandler(function (error, dom) {
	    if (error)
	    	console.log("DOM ERRER");
	    else{
	        console.log("DOM COMPLETE");
	        var html = dom.filter(function(ele){
	        	return ele.name === 'html';
	        });
	        var body = html[0].children.filter(function(ele){
	        	return ele.name === 'body';
	        });
	        
	        var table = body[0].children.filter(function(ele){
	        	return ele.name === 'table';
	        });
	        var tr = table[0].children.filter(function(ele){
	        	return ele.name == 'tr';
	        });
	        var list = [];
	        tr.forEach(function(ele){
	        	var td = ele.children.filter(function(eele){
	        		return eele.name === 'td';
	        	});
	        	var name = td[0].children[0].data;
	        	var score = td[td.length-1].children[0].children[0].data;
	        	console.log(name); // Name
	        	console.log(score); // Score
	        	list.push({name:name, score:score});
	        	// var now = {td[0].children[0].data : td[td.length-1].children[0].children[0].data};
	        	// list.push(now);
	        	
	        });
	        callback(list);

	    }
	});
	var parser = new htmlparser.Parser(handler);

	function req(contestID){
		request({
		    url: 'http://acm.hust.edu.cn/vjudge/contest/statistic.action',
		    qs: {cids: contestID, afterContest: 0},
		    method: 'GET',
		    headers: {
		        //'Connection': 'close',
		        'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.87 Safari/537.36'
			}}, function(err,response,body){
				if(!err && response.statusCode == 200){
					//console.log(body);
					parser.write(body);
					parser.done();
				}
				else
					console.log("GET VJUDGE ERROR "+err);
		});
	}
	req(contestID);
}
// addData('107970,111156',function(list){
// 	console.log(list);
// });
module.exports.addData = addData;
