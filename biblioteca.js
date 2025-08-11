function createTable(container, N) {
    const table = document.createElement("table");
	const tbody = document.createElement("tbody"); // Removing tbody?
    table.setAttribute('size', N);
    
    const tr = document.createElement('tr');
    const td = document.createElement('td');
    td.setAttribute('touched', '0');
    
    for (let j = 0; j < N; j++) {
        tr.appendChild(td.cloneNode(true));
    }
    
    for (let i = 0; i < N; i++) {
        tbody.appendChild(tr.cloneNode(true));
    }
    
	container.insertBefore(table, container.firstChild);
    table.insertBefore(tbody, table.firstChild);
	setTableClasses(container);
}

function deleteTable(container) {
	container.childNodes[0].remove();
}

function clearTable(container) {
	const N = parseInt(container.childNodes[0].getAttribute("size"));
	const tbody = container.childNodes[0].childNodes[0];

	// something
}


function setTableClasses(container) {
	const N = parseInt(container.childNodes[0].getAttribute("size"));
	const tbody = container.childNodes[0].childNodes[0];

	var i, j;
	for (var i = 0; i < N; i++) {
		tbody.childNodes[i].setAttribute("class", i + 1);
		for (var j = 0; j < N; j++) {
			tbody.childNodes[i].childNodes[j].classList.add(Math.max(i, j) + 1);
		}
	}

	setVarCellsByClass(container);
}



// Classic debounce function
function debounce(func, wait) {
	let timeout;
	return (...args) => {
		clearTimeout(timeout);
		timeout = setTimeout(() => { func.apply(this, args); }, wait);
	};
}



/* ------------ *
 * RANGE SLIDER * 
 * ------------ */

function resizeTableFromRange(container, event) {
	resizeTableDebounced(container, event.target.value);
}

var resizeTableDebounced = debounce(resizeTable, 100);

function resizeTable(container, N) {
	//var time1 = (new Date()).getTime();

	deleteTable(container);
	createTable(container, N);
	
	//var time2 = (new Date()).getTime();
	//console.log(time2-time1);
} 



/* ------------------ *
 * DRAWING MANAGEMENT * 
 * ------------------ */
function removeTouchesOnTable(container) {
	var N = parseInt(container.childNodes[0].getAttribute("size"));
	var tbody = container.childNodes[0].childNodes[0]
	for (var i = 0; i < N; i++) {
		for (var j = 0; j < N; j++) {
			tbody.childNodes[i].childNodes[j].setAttribute("touched", "0");
		}
	}
}

function updateTablePos(tablePos, container) {
	var tableRect = container.childNodes[0].getBoundingClientRect();
	var cell00Rect = container.childNodes[0].childNodes[0].childNodes[0].childNodes[0].getBoundingClientRect();

	tablePos.clientX = tableRect.x;
	tablePos.clientY = tableRect.y;
	tablePos.cellDX = cell00Rect.width;
	tablePos.cellDY = cell00Rect.height;
}


function getCellByPos(clientX, clientY, tablePos, container) {
	var rowIndex = Math.floor((clientY - tablePos.clientY) / tablePos.cellDY);
	var colIndex = Math.floor((clientX - tablePos.clientX) / tablePos.cellDX);
	
	var row = container.childNodes[0].childNodes[0].childNodes[rowIndex];
	if (row == undefined) {
		return undefined;
	}

	var cell = row.childNodes[colIndex];
	if (cell == undefined) {
		return undefined;
	} else {
		return cell;
	}
}


function paintCellByMouse(event) { // Or pointer
	// Left click + target is cell + target is untouched
	if (event.buttons == 1 && event.target.nodeName == "TD" && event.target.getAttribute("touched") == "0") {
		paintCell(event.target);
	}
}


function paintCellByTouch(event, tablePos, container) {
	// event.preventDefault(); // Conservare?

	var touch, cell;
	// Draws only if one finger is touching the screen
	if (event.touches.length == 1) {
		touch = event.touches[0];
		cell = getCellByPos(touch.clientX, touch.clientY, tablePos, container);
		if (cell != undefined && cell.getAttribute("touched") == "0") {
			paintCell(cell);
		}
	}
}


function paintCell(cell) {
	if (cell.getAttribute("touched") == "0") {
	if (cell.style.backgroundColor == "black") {
		cell.style.backgroundColor = "white";
	} else {
		cell.style.backgroundColor = "black";
	}
}
	cell.setAttribute("touched", "1");
}