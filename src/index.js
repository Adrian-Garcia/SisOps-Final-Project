// Declare memory arrays
let M = new Array(2048);	
let S = new Array(4096);
let time = 0;
let result = [];

let usedProcesses = [];

processes = [];
// los maps son chidos
let processesStartTime = new Map();
let processesFaultNum = new Map();
let processesTurnAround = new Map();

function fillArray() {
	for (let i = 0; i < M.length; i++) {
		if (M[i] == undefined) {
			M[i] = {
				processName: "",
				isOccupied: false,
				timeStamp: 0
			};
		}
	}
	for (let i = 0; i < S.length; i++) {
		if (S[i] == undefined) {
			S[i] = {
				processName: "",
				isOccupied: false,
				timeStamp: 0
			};
		}
	}
}

function updateLeastRecentlyUsed(process) {
	//Check if the process is already used
	for (let i = 0; i < usedProcesses.length; i++) {
		if (usedProcesses[i] == process) 
			usedProcesses.splice(i, 1);
	}

	//Update last recently used
	usedProcesses.push(process);
}

function firstUsed() {
	//Find the first frame of the least recently used
	let lru = 0;
	let first = false;
	for (let i = 0; i < M.length / 16 && !first; i++) {
		if (M[i * 16].name == usedProcesses[0]) {
			lru = i * 16;
			first = true;
		}
	}
	//Find the first used frame of the least recently used
	for (let i = lru / 16; i < M.length / 16; i++) {
		if (M[i*16].name == usedProcesses[0] && M[i * 16].timeStamp < M[lru].timeStamp)
			lru = i * 16;
	}
	return lru;
}

function firstIn() {
	let firstPos = 0;
	for (let i = 1; i < M.length / 16; i++) {
		if (M[i * 16].timeStamp < M[firstPos].timeStamp)
			firstPos = i * 16;
	}
	return firstPos;
}

function fifo(pName, inVirtualMemory, page) {
	console.log('Entre a fifo');
	let frameUsed;
	// Get the position of the frame that first entered M
	let frameToSwapPos = firstIn();

	/// Swap out the frame that first entered M
	for (let i = 0; i < S.length; i++) {
		if (!S[i].isOccupied) {
			frameUsed = Math.floor(i / 16);
			for (let j = i; j < i + 16; j++) {
				S[j] = {
					processName: M[frameToSwapPos].processName,
					isOccupied: true,
					timeStamp: time
				};
			}
			time += 1;
			console.log('Swapped out frame');
			break;
		}
	}

	/// Save the frame where it was swapped out
	// Find the process
	for (let i = 0; i < processes.length; i++) {
		if (processes[i].name == M[frameToSwapPos].processName) {
			console.log('process swapped out found.');
			// Find the frame that was swapped out
			for (let f = 0; f < processes[i].frames.length; f++) {
				if (processes[i].frames[f] == frameToSwapPos / 16) {
					console.log('frame swapped out found.');
					// remove frame reference to real memory
					processes[i].frames[f] = null;
					// add frame reference to virtual memory
					processes[i].virtualFrames[f] = frameUsed;

					result.push('Página ' + f + ' del proceso ' + M[frameToSwapPos].processName + ' swappeada al marco ' + frameUsed + ' del área de swapping.');
				}
			}
		}
	}

	/// Swap in the frame required
	for (let i = frameToSwapPos; i < frameToSwapPos + 16; i++) {
		M[i] = {
			processName: pName,
			isOccupied: true,
			timeStamp: time
		};
	}
	time += 1;

	/// If the frame swapped in was in virtual memory, remove it
	if (inVirtualMemory) {        
		for (let i = 0; i < processes.length; i++) {            
			if (processes[i].name == pName) {
				if (S[processes[i].virtualFrames[page] * 16].isOccupied && S[processes[i].virtualFrames[page] * 16].processName == pName) {
					for (let j = processes[i].virtualFrames[page] * 16; j < processes[i].virtualFrames[page] * 16 + 16; j++) {
						S[j] = {
							isOccupied: false
						};
					}
				}
				result.push('Se localizó la página ' + page + ' del proceso ' + pName + ' que estaba en la posición ' + processes[i].virtualFrames[page] * 16 + ' de swapping y se cargó al marco ' + frameToSwapPos / 16 + '.');
				// add frame reference to real memory
				processes[i].frames[page] = frameToSwapPos / 16;
				// remove frame reference to virtual memory
				processes[i].virtualFrames[page] = null;

			}
		}
	}
	return frameToSwapPos / 16;
}

function lru(pName, inVirtualMemory, page) {
	console.log('Entre a lru');
	let frameUsed;
	// Get the position of the least recently used frame that entered M
	let frameToSwapPos = firstUsed();

	/// Swap out the frame that first entered M
	for (let i = 0; i < S.length; i++) {
		if (!S[i].isOccupied) {
			frameUsed = Math.floor(i / 16);
			for (let j = i; j < i + 16; j++) {
				S[j] = {
					processName: M[frameToSwapPos].processName,
					isOccupied: true,
					timeStamp: time
				};
			}
			time += 1;
			console.log('Swapped out frame');
			break;
		}
	}

	/// Save the frame where it was swapped out
	// Find the process
	for (let i = 0; i < processes.length; i++) {
		if (processes[i].name == M[frameToSwapPos].processName) {
			console.log('process swapped out found.');
			// Find the frame that was swapped out
			for (let f = 0; f < processes[i].frames.length; f++) {
				if (processes[i].frames[f] == frameToSwapPos / 16) {
					console.log('frame swapped out found.');
					// remove frame reference to real memory
					processes[i].frames[f] = null;
					// add frame reference to virtual memory
					processes[i].virtualFrames[f] = frameUsed;

					result.push('Página ' + f + ' del proceso ' + M[frameToSwapPos].processName + ' swappeada al marco ' + frameUsed + ' del área de swapping.');
				}
			}
		}
	}

	/// Swap in the frame required
	for (let i = frameToSwapPos; i < frameToSwapPos + 16; i++) {
		M[i] = {
			processName: pName,
			isOccupied: true,
			timeStamp: time
		};
	}
	time += 1;

	/// If the frame swapped in was in virtual memory, remove it
	if (inVirtualMemory) {
		for (let i = 0; i < processes.length; i++) {
			if (processes[i].name == pName) {
				if (S[processes[i].virtualFrames[page] * 16].isOccupied && S[processes[i].virtualFrames[page] * 16].processName == pName) {
					for (let j = processes[i].virtualFrames[page] * 16; j < processes[i].virtualFrames[page] * 16 + 16; j++) {
						S[j] = {
							isOccupied: false
						};
					}
				}
				result.push('Se localizó la página ' + page + ' del proceso ' + pName + ' que estaba en la posición ' + processes[i].virtualFrames[page] * 16 + ' de swapping y se cargó al marco ' + frameToSwapPos / 16 + '.');
				// add frame reference to real memory
				processes[i].frames[page] = frameToSwapPos / 16;
				// remove frame reference to virtual memory
				processes[i].virtualFrames[page] = null;

			}
		}
	}
	return frameToSwapPos / 16;
}

function accessMemory(query) {

	// Show user input
	result.push("<i>" + query[0] + " " + query[1] + " " + query[2] + " " + query[3] + "</i>");

    // Show what the command is going to do
    let instruction = '<b>Obtener la dirección real correspondiente a la dirección virtual ' + query[1] + ' del proceso ' + query[2] + '</b>';
    let page = Math.floor(query[1] / 16);
    if (query[3] == '1') {
        instruction += '<b> y modificar dicha dirección.</b>';
        result.push(instruction);
        // if the address is modified, notify the user what page of what process was changed
        result.push('Página ' + page + ' del proceso ' + query[2] + ' modificada.');
    }
    else {
        result.push(instruction);
	}

	//Update the process
	updateLeastRecentlyUsed(query[2]);
	
	time += 0.1;
	let realAddress;
	
    for (let i = 0; i < processes.length; i++) {
        if (processes[i].name == query[2]) {
            // check if desired address isnt in real memory
            if (processes[i].frames[page] == null && processes[i].virtualFrames[page] != null){
				// Do replacement algorithm to load it to real memory
				if ($("#sel1").val() == "FIFO") {
					fifo(processes[i].name, true, page);
				}
				else {
					lru(processes[i].name, true, page);
				}
                
            }
            realAddress = (processes[i].frames[page] * 16) + (query[1] % 16) ;
            break;
        }
    }
	if (realAddress != undefined) {
		result.push('Direccion virtual: ' + query[1] + ', Dirección real: ' + realAddress + '.');
		result.push("<div class='space-result'></div>");
	}

	else {
		result.push("<div class='space-result'></div>");
		result.push(`<div class="command-error">Error en acceso a la memoria</div>`);
		result.push("<div class='space-result'></div>");
	}
}

function freeSpace(query) {
	result.push("<i>" + query[0] + " " + query[1] + "</i>");
	result.push("<b>Liberar los marcos de página ocupados por el proceso " + query[1] + "</b>");

	let framesToRelease = [];
	let virtualFramesToRelease = [];
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
	for (let i = 0; i < 4096; i++) {
		if (S[i].processName == query[1]) {
			virtualFramesToRelease.push(Math.floor(i / 16));
			for (let j = i; j < i + 16; j++) {
				S[j] = {
					processName: "",
					isOccupied: false
				};
			}
			i += 15;
		}
	}

	for (let i = 0; i < processes.length; i++) {   
		if (processes[i].name == query[1]) {
			processes.splice(i, 1);
		}
	}

	if (framesToRelease.length > 0) { 
		let realText = "Se liberan los marcos de memoria real: ";
		for (let i = 0; i < framesToRelease.length; i++) {
			realText += framesToRelease[i] + ", ";
		}
		realText = realText.substring(0, realText.length - 2);
		//Push result
		result.push(realText);
	}

	if (virtualFramesToRelease.length > 0) {
		let virtualText = "Se liberan los marcos "
		for (let i = 0; i < virtualFramesToRelease.length; i++) {
			virtualText += virtualFramesToRelease[i] + ", ";
		}
		virtualText = virtualText.substring(0, virtualText.length - 2);
		virtualText += " del área de swapping";
		result.push(virtualText);
	}

    // Calculate turnaround time and save it in map
	processesTurnAround.set(query[1], time - processesStartTime.get(query[1]));
	
    //Push result
	result.push("<div class='space-result'></div>");
}

function loadProcess(query) {
	result.push("<i>" + query[0] + " " + query[1] + " "+ query[2] + "</i>");
	//Este push pide que lo imprimamos, no le muevas
	result.push("<b>Asignar " + query[1] + " bytes al proceso " + query[2] + "</b>");

	let requiredFrames = Math.ceil(query[1] / 16); 
    let framesToUse = [];
    // Save start time of the process in map
    processesStartTime.set(query[2], time);
    // Initialize map entry of the process to later add to its value when needed
    processesFaultNum.set(query[2], 0);

	for (let i = 0; i < 2048 && 0 < requiredFrames; i++) {
		if (!M[i].isOccupied) {
			framesToUse.push(Math.floor(i / 16));
			for (let j = i; j < i + 16; j++) {
				M[j] = {
					processName: query[2],
					isOccupied: true,
					timeStamp: time
				};
			}
			i += 15;
			requiredFrames--;
			time += 1;
		}
	}
	console.log('M[0] = ' + M[0].processName);
	if (requiredFrames > 0) {
        for (let i = 0; i < requiredFrames; i++) {
			if ($("#sel1").val() == "FIFO") {
				framesToUse.push(fifo(query[2], false, framesToUse.length));
			}
			else {
				framesToUse.push(lru(query[2], false, framesToUse.length));
			}
        }
	}
	
	//Para ir guardando los procesos que se van usando y saber cuales estan ocupados
	processes.push({name: query[2], frames: framesToUse, virtualFrames: new Array(Math.ceil(query[1] / 16))});

	//Actualizar el ultimo proceso que fue utilizado
	updateLeastRecentlyUsed(query[2]);

	console.log('proceso[0] = ' + processes[0].name);
	
	//Imprimir textito final
	let finalText = "Se asignaron los marcos de página [";
	for (let i = 0; i < framesToUse.length; i++) {
		finalText += framesToUse[i] + ", ";
	}
	finalText = finalText.substring(0, finalText.length - 2);
	finalText += "] al proceso " + query[2];

	result.push(finalText);
	result.push("<div class='space-result'></div>");
}

function addComment(query) {
	let comment = `<div class="comment">`;
	for (let i = 1; i < query.length; i++) {
		comment += query[i] + " ";
	}
	comment += "</div>";	
	result.push(comment);
	result.push("<div class='space-result'></div>");
}

function appendCode() {
    let promedioTurnaround = 0;
    processesTurnAround.forEach(function(value, key) {

    	valueFixed = value.toFixed(2);

        result.push('Proceso ' + key + ' tuvo un Turnaround time de: ' + valueFixed + ' segundos.');
        promedioTurnaround += value;
    });
    let numOfSwaps = promedioTurnaround;
    promedioTurnaround /= processesTurnAround.size;
    result.push('El Turnaround time promedio fue: ' + promedioTurnaround + ' segundos.');
    result.push('Se hicieron ' + numOfSwaps + ' operaciones de swap in y swap out.');
	result.push("<div class='space-result'></div>");

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
		
			if (query[i][0].toLowerCase() != 'c') {
				
				let analyzer = query[i].substr(1, query[i].length);

				if (analyzer.match(/[a-z]/i)) {
					query[i] += "e"; 
				}
			}
		}

		// Clear result 
		result = [];

		// Go to the function that the string correspond
		for (let i=0; i<query.length; i++) {
			let command = query[i].split(' ');

			if (command[0] == "")
				continue;

			if (query[i].charAt(query[i].length-1) == "e") {

				result.push(`
					<div class="command-error">
						Comando ${query[i].substr(0, query[i].length-1)} no ejecutado 
					</div>
					<div class="space-result"></div>
				`);

				continue;
			}

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