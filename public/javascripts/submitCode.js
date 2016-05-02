document.addEventListener('DOMContentLoaded', main);
function main(){
	var button = document.querySelector('#submit');
	var problem_id = document.querySelector('#problem_id').innerText;
	var code = document.querySelector('#submit_code');
	var board = document.querySelector('.result');
	var notification = document.createElement('div');
	notification.className = 'notification';
	var message = document.createElement('h2');
	var message_small = document.createElement('p');
	while(board.firstChild)
		board.removeChild(board.firstChild);
	var language = document.querySelector('.language');
	if (button) button.addEventListener('click', submit);
	function submit(evt){
		evt.preventDefault();
		var code_text = code.value;
		var req = new XMLHttpRequest();
		req.open('POST','/api/problems/submit');
		req.addEventListener('load', function(){
			if(req.status >= 200 && req.status < 400){
				message.innerText = 'In Progress...';
				message_small.innerText = '';
				notification.appendChild(message);
				notification.appendChild(message_small);
				notification.style['background-color']='blue';
				board.appendChild(notification);
				var submission = JSON.parse(req.responseText);
				console.log("SID: "+submission.submission_id);

				// Disabled Button
				button.removeEventListener('click', submit);
				button.setAttribute('disabled','disabled');
				trackSubmission(submission.submission_id);
			}
		});
		req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

		// Pass problem id and code to the backend by Ajax
		// Encoded the source code
		var tmp = "problem_id="+problem_id+"&code="+encodeURIComponent(code_text)+"&language="+language.value;
		req.send(tmp);
	}
	// This method is for testing only
	function testTrack(evt){
		evt.preventDefault();
		trackSubmission(64208);
	}
	// Track the submission detail
	function trackSubmission(submission_id){
		var req = new XMLHttpRequest();
		req.open('GET','/api/problems/track?submission_id='+submission_id);
		req.addEventListener('load', function(){
			if(req.status >= 200 && req.status < 400){
				var msg = req.responseText;
				var obj = JSON.parse(msg);
				console.log("Progress: "+obj.result);
				if(obj.result === 'running')
					trackSubmission(submission_id);
				else{
					message.innerText = obj.result;
					message_small.innerText = obj.message;
					notification.style['background-color']=obj.color;
					if(obj.result == 'Compiling' || obj.result == 'Running'){
						trackSubmission(submission_id);
					}
					else{
						// Recover Button
						button.addEventListener('click', submit);
						button.removeAttribute('disabled');
					}
				}
			}
		});
		req.send();
	}
}