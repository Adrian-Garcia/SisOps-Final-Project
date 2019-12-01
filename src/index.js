// Declare memory arrays
let M = new Array(2048);	
let S = new Array(4096);

let result = [];

processes = [];

let process = {
	name: "",
	frames: []
}

let occupied = {
	processName: "",
	isOccupied: false
}

function fillArray() {
	for (let i = 0; i < M.length; i++) {
		if (M[i] == undefined) {
			M[i] = {
				processName: "",
				isOccupied: false
			};
		}
	}
}

function accessMemory(query) {
    // Show user input
    result.push(query);
    // Show what the command is going to do
    let instruction = 'Obtener la dirección real correspondiente a la dirección virtual ' + query[1] + 'del proceso ' + query[2];
    let page = Math.floor(query[1] / 16);
    if (query[3] == '1') {
        instruction += ' y modificar dicha dirección.';
        result.push(instruction);
        // if the address is modified, notify the user what page of what process was changed
        result.push('Página ' + page + ' del proceso ' + query[2] + ' modificada.');
    }
    else {
        result.push(instruction);
    }
    let realAddress;
    for (let i = 0; i < processes.length; i++) {
        if (processes[i].name == query[2]) {
            for (let f = 0; f < processes[i].frames.length; f++) {
                
            }
        }
    }

	// Tienes que pushear el resultado. No seas pendejo y lo dejes así
	result.push("accessMemory");
}

function freeSpace(query) {
	result.push("<i>" + query[0] + " " + query[1] + "</i>");
	result.push("<b>Liberar los marcos de página ocupados por el proceso " + query[1] + "</b>");

	let framesToRelease = [];
	for (let i = 0; i < 2048; i++) {
		if (M[i].processName == query[1]) {
			framesToRelease.push(Math.floor(i / 16));
			for (let j = i; j < i + 16; j++) {
				M[j] = {
					processName: "",
					isOccupied: false
				};
			}
			i += 15;
		}
	}

	console.log(framesToRelease);
	let realText = "Se liberan los marcos de memoria real: ";
	for (let i = 0; i < framesToRelease.length; i++) {
		realText += framesToRelease[i] + ", ";
	}
	realText = realText.substring(0, realText.length - 2);

	result.push(realText);
	result.push("Se liberan los marcos //UWU del área de swapping");
}

function loadProcess(query) {
	result.push("<i>" + query[0] + " " + query[1] + " "+ query[2] + "</i>");
	//Este push pide que lo imprimamos, no le muevas
	result.push("<b>Asignar " + query[1] + " bytes al proceso " + query[2] + "</b>");

	let requiredFrames = Math.ceil(query[1] / 16); 
	let framesToUse = [];

	occupied.processName = query[2];
	occupied.isOccupied = true;

	//Falta hacer cambio de procesos cuando ya estan ocupados
	for (let i = 0; i < 2048 && 0 < requiredFrames; i++) {
		if (!M[i].isOccupied) {
			framesToUse.push(Math.floor(i / 16));
			for (let j = i; j < i + 16; j++) {
				M[j] = occupied;
			}
			i += 15;
			requiredFrames--;
		}
	}

	if (requiredFrames > 0) {
		//Estrategia de remplazo aqui
	}

	//Para ir guardando los procesos que se van usando y saber cuales estan ocupados
	process.name = query[2];
	process.frames = framesToUse;
	processes.push(process);


	//Imprimir textito final
	let finalText = "Se asignaron los marcos de página [";
	for (let i = 0; i < framesToUse.length; i++) {
		finalText += framesToUse[i] + ", ";
	}
	finalText = finalText.substring(0, finalText.length - 2);
	finalText += "] al proceso " + query[2];

	result.push(finalText);
}

function addComment(query) {
	let comment = `<div class="comment">`;
	for (let i = 1; i < query.length; i++) {
		comment += query[i] + " ";
	}
	comment += "</div>";	
	result.push(comment);
}

function appendCode() {

	$(".result-content").empty();

	for (let i=0; i<result.length; i++) {
		$(".result-content").append(`
			<div class="result-line-output">${result[i]}</div>
		`);
	}
	
	$(".clear-btn").show();
}

function main() {

	$(".clear-btn").hide();

	$(".clear-btn").on("click", function() {
		$(".result-content").empty();
		$(".clear-btn").hide();  
	});

	fillArray();

	// Click on input button
	$("#input-btn").on("click", function() {

		// Store data that user set
		let query = $("#input").val();

		// Split array line by line
		query = query.split('\n');

		// If user put several spaces, the program fix this and only put one at every query
		for (let i=0; i<query.length; i++) {
			let j=0;
			while (query[i][j] == ' ') j++;
			query[i] = query[i].substr(j, query[i].length);
			query[i] = query[i].replace(/  +/g, ' ');
		}

		console.log(query);

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
					// window.open("./end.html");
				break;
			}
		}
	});
}
main();