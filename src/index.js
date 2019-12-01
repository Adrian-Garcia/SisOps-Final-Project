// Declare memory arrays
let M = new Array(2048);	
let S = new Array(4096);

let result = [];

function accessMemory(query) {

	// Tienes que pushear el resultado. No seas pendejo y lo dejes así
	result.push("accessMemory");
}

function freeSpace(query) {

	// Tienes que pushear el resultado. No seas pendejo y lo dejes así
	result.push("freeSpace");
}

function loadProcess(query) {

	// Tienes que pushear el resultado. No seas pendejo y lo dejes así
	result.push("loadProcess");
}

function addComment(query) {
	
	// Tienes que pushear el resultado. No seas pendejo y lo dejes así
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

		// Clear result 
		result = [];

		// Go to the function that the string correspond
		for (let i=0; i<query.length; i++) {
			let command = query[i].split(' ');

			if (command[0] == "")
				continue;

			switch(command[0].toLowerCase()) {

				// Acces virtual memory
				case 'a':
					accessMemory(command);
				break;

				// Free pages at process "p"
				case 'l':
					freeSpace(command);
				break;

				// Load proces on memory
				case 'p':
					loadProcess(command);
				break;

				// Comment
				case 'c':
					addComment(command);
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