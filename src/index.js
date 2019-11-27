// Declare memory arrays
let M = new Array(2048);	
let S = new Array(4096);

let result = [];

function accessMemory(query) {
	result.push("accessMemory");
}

function freeSpace(query) {
	result.push("freeSpace");
}

function loadProcess(query) {
	result.push("loadProcess");
}

function addComment(query) {
	result.push("addComment");
}

function appendCode() {

	$(".result-content").empty();

	for (let i=0; i<result.length; i++) {
		$(".result-content").append(`
			<div class="result-line-output">${result[i]}</div>
		`);
	}
}

function main() {

	// Click on input button
	$("#input-btn").on("click", function() {

		// Store data that user set
		let query = $("#input").val();

		// Split array line by line
		query = query.split('\n');

		// If user put spaces at first, the program fix this and get the first letter of every line
		for (let i=0; i<query.length; i++) {
			let j=0;
			while (query[i][j] == ' ') j++;
			query[i] = query[i].substr(j, query[i].length);
		}

		result = [];		

		// Go to the function that the string correspond
		for (let i=0; i<query.length; i++) {

			if (query[i] == "")
				continue;

			switch(query[i].toLowerCase()) {

				// Acces virtual memory
				case 'a':
					accessMemory(query[i]);
				break;

				// Free pages at process "p"
				case 'l':
					freeSpace(query[i]);
				break;

				// Load proces on memory
				case 'p':
					loadProcess(query[i]);
				break;

				// Comment
				case 'c':
					addComment(query[i]);
				break;

				// End package of requests
				case 'f':
					appendCode();
				break;

				// End program
				case 'e':
					console.log("Pues bye");
				break;
			}
		}
	});
}
main();