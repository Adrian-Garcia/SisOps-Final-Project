// Declare memory arrays
let M = new Array(2048);
let S = new Array(4096);

function main() {

	// Click on input button
	$("#input-btn").on("click", function() {

		// Store data that user set
		let query = $("#input").val();
		let i=0;

		// If user put spaces at first, the program fix this and get the first letter
		while (query[i] == ' ') i++;
		query = query.substr(i, query.length);

		// Go to the function that the string correspond
		switch(query[i]) {
			
			case 'p':
			break;
			
			case 'a':
			break;
		}
	});
}
main();