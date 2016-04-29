document.addEventListener('DOMContentLoaded', main);
function main(){
	var button = document.querySelector('#add');
	var problem_id = document.querySelector('#problem_id');
	var problem_title = document.querySelector('#problem_title');
	var problem_description = document.querySelector("#problem_description");
	var input_description = document.querySelector('#input_description');
	var output_description = document.querySelector('#output_description');
	var addFrame = document.querySelector(".problem_add");
	if(button)
		button.addEventListener('click', showAdd);
	if(submit_problem)
		submit_problem.addEventListener('click', submitProblem);
	function showAdd(evt){
		// console.log('display');
		if(addFrame.style.display == 'block')
			addFrame.style.display = 'none';
		else
			addFrame.style.display = 'block';
	}
}