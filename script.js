const square = document.getElementsByClassName("square");
const table = document.getElementsByClassName("table");
let turn = "o";
let lastTurn = "o";
let dark = false;
let onlineSide = null;
const winCondition = 
    [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6]
];
let activeTable = 9;
let finishedTable = [
    0,0,0,
    0,0,0,
    0,0,0
];

function readSquare(tableIndex, squareIndex) {
    const selectedSquare = getSquaresByTable(tableIndex)[squareIndex].childNodes;
    if (selectedSquare.length > 0) {
        result = selectedSquare[0].textContent;
        return result;
    }
    return null;
}
function start() {
    document.getElementById("game").style.cursor = "url(oCursor.png), auto";
    for (let x = 0; x < table.length; x++) {
        for (let y = 0; y < getSquaresByTable(x).length; y++) { // for all squares
            getSquaresByTable(x)[y].addEventListener("click", function(){
                // check if valid turn
                if (readSquare(x,y) === null && finishedTable[x] === 0 && (activeTable === x || activeTable === 9) && (onlineSide === turn || onlineSide === null)) {
                    // insert image
                    if (turn === "o") {
                        createMark(x,y,"O");
                    }
                    else {
                        createMark(x,y,"X")
                    }
                    updateTurn(x, y);

                    if (activePeer !== null) {
                        activePeer.send({
                            "type":"postMark",
                            "data":[x, y]
                        })
                    }
                }
            });
        }
    }
    
}
function createMark(tableIndex, squareIndex, text) {
    const parElement = document.createElement("p");
    const parContent = document.createTextNode(text);
    parElement.appendChild(parContent);
    getSquaresByTable(tableIndex)[squareIndex].appendChild(parElement);
}
function createTableMark(tableIndex, text) {
    const divElement = document.createElement("div")
    const parElement = document.createElement("p");
    const parContent = document.createTextNode(text);
    parElement.appendChild(parContent);
    divElement.appendChild(parElement);
    divElement.classList.add("completedTable");
    table[tableIndex].appendChild(divElement);
}
function getSquaresByTable(index) {
    const result = table[index].getElementsByClassName("square");
    return result
}
function localUpdate(tableIndex) {
    // Checks for local draw
    finishedTable[tableIndex] = 3;
    for (let i = 0; i < getSquaresByTable(tableIndex).length; i++) {
        if (readSquare(tableIndex,i) === null) {
            finishedTable[tableIndex] = 0;
            winUpdate();
        }
    }

    // Check for win
    for (let i = 0; i < winCondition.length; i++) {
        if (readSquare(tableIndex, winCondition[i][0]) === 'O' && readSquare(tableIndex, winCondition[i][1]) === 'O' && readSquare(tableIndex, winCondition[i][2]) === 'O') {
            getSquaresByTable(tableIndex)[winCondition[i][0]].style.backgroundColor = "cornflowerBlue";
            getSquaresByTable(tableIndex)[winCondition[i][1]].style.backgroundColor = "cornflowerBlue";
            getSquaresByTable(tableIndex)[winCondition[i][2]].style.backgroundColor = "cornflowerBlue";
            finishedTable[tableIndex] = 1;
            createTableMark(tableIndex, "O");
            winUpdate();
            break;
        }
        else if (readSquare(tableIndex, winCondition[i][0]) === 'X' && readSquare(tableIndex, winCondition[i][1]) === 'X' && readSquare(tableIndex, winCondition[i][2]) === 'X') {
            getSquaresByTable(tableIndex)[winCondition[i][0]].style.backgroundColor = "cornflowerBlue";
            getSquaresByTable(tableIndex)[winCondition[i][1]].style.backgroundColor = "cornflowerBlue";
            getSquaresByTable(tableIndex)[winCondition[i][2]].style.backgroundColor = "cornflowerBlue";
            finishedTable[tableIndex] = 2;
            createTableMark(tableIndex, "X");
            winUpdate();
            break;
        }
    }
}
function focusUpdate(squareIndex) {
    for (let i = 0; i < table.length; i++) {
        table[i].style.boxShadow = "0 0 5px -5px cornflowerblue";
    }

    if (finishedTable[squareIndex] === 0) {
        table[squareIndex].style.boxShadow = "0 0 0 5px cornflowerblue";
        activeTable = squareIndex;
    }
    else {
        activeTable = 9;
        for (let i = 0; i < table.length; i++) {
            if (finishedTable[i] === 0) {
                table[i].style.boxShadow = "0 0 0 5px cornflowerblue";
            }
        }
    }
}
function checkDraw() {
    for (let i = 0; i < finishedTable.length; i++) {
        if (finishedTable[i] === 0) {
            return false;
        }
    }
    return true;
}
function winUpdate() {
    if (checkDraw() === true) {
        document.getElementById("turn").textContent = "Draw!";
        document.getElementById("game").style.cursor = "default";

    }

    for (let i = 0; i < winCondition.length; i++) {
        if (finishedTable[winCondition[i][0]] === 1 && finishedTable[winCondition[i][1]] === 1 && finishedTable[winCondition[i][2]] === 1) {
            table[winCondition[i][0]].children[9].style.backgroundColor = "cornflowerBlue";
            table[winCondition[i][1]].children[9].style.backgroundColor = "cornflowerBlue";
            table[winCondition[i][2]].children[9].style.backgroundColor = "cornflowerBlue";
            finishedTable = [3,3,3,3,3,3,3,3,3];
            focusUpdate(9)
            if (onlineSide === "o") {
                document.getElementById("turn").textContent = "You win!";
            }
            else if (onlineSide === "x") {
                document.getElementById("turn").textContent = "Opponent wins!";
            }
            else {
                document.getElementById("turn").textContent = "O wins!";
            }
            document.getElementById("game").style.cursor = "default";
        }
        if (finishedTable[winCondition[i][0]] === 2 && finishedTable[winCondition[i][1]] === 2 && finishedTable[winCondition[i][2]] === 2) {
            table[winCondition[i][0]].children[9].style.backgroundColor = "cornflowerBlue";
            table[winCondition[i][1]].children[9].style.backgroundColor = "cornflowerBlue";
            table[winCondition[i][2]].children[9].style.backgroundColor = "cornflowerBlue";
            finishedTable = [3,3,3,3,3,3,3,3,3];
            focusUpdate(9)
            if (onlineSide === "x") {
                document.getElementById("turn").textContent = "You win!";
            }
            else if (onlineSide === "o") {
                document.getElementById("turn").textContent = "Opponent wins!";
            }
            else {
                document.getElementById("turn").textContent = "X wins!";
            }
            document.getElementById("game").style.cursor = "default";
        }
        
    }
}
function updateTurn(tableIndex, squareIndex) {
    // Passes on the turn
    if (turn === "o") {
        if ("o" === onlineSide) {
            document.getElementById("turn").textContent = "Opponents turn";
            document.getElementById("game").style.cursor = "not-allowed";
        }
        else if ("x" === onlineSide) {
            document.getElementById("turn").textContent = "Your turn";
            document.getElementById("game").style.cursor = "url(xCursor.png), auto";
        }
        else {
            document.getElementById("turn").textContent = "X's turn";
            document.getElementById("game").style.cursor = "url(xCursor.png), auto";
        }
        turn = "x";
    }
    else {
        if ("x" === onlineSide) {
            document.getElementById("turn").textContent = "Opponents turn";
            document.getElementById("game").style.cursor = "not-allowed";
        }
        else if ("o" === onlineSide) {
            document.getElementById("turn").textContent = "Your turn";
            document.getElementById("game").style.cursor = "url(oCursor.png), auto";
        }
        else {
            document.getElementById("turn").textContent = "O's turn";
            document.getElementById("game").style.cursor = "url(oCursor.png), auto";
        }
        turn = "o";
    }
    localUpdate(tableIndex);
    focusUpdate(squareIndex);
   
    //  document.getElementById("turn").textContent = "O wins!";
}
function restart() {
    onlineSide = null
    disconnect()
    for (let i = 0; i < square.length; i++) {
        if (square[i].childNodes.length > 0) {
            square[i].removeChild(square[i].childNodes[0]);
        }  
        square[i].style.backgroundColor = "";
    }
    for (let i = 0; i < table.length; i++) {
        if (table[i].children.length === 10) {
            table[i].removeChild(table[i].children[9]);
        }
    }
    finishedTable = [
        0,0,0,
        0,0,0,
        0,0,0
    ];
    if (lastTurn === "o") {
        document.getElementById("turn").textContent = "X's turn";
        turn = "x";
        lastTurn = "x";
        document.getElementById("game").style.cursor = "url(xCursor.png), auto";
    }
    else {
        document.getElementById("turn").textContent = "O's turn";
        turn = "o";
        lastTurn = "o";
        document.getElementById("game").style.cursor = "url(oCursor.png), auto";
    }
    focusUpdate(9);
}

function darkmode() {
    if (dark === false) {
        document.getElementById("dark").src = "light.png";
        document.documentElement.classList.add("darkmode");
        document.getElementById("title").classList.add("darkmode");
        document.getElementById("turn").classList.add("darkmode");
        document.getElementById("footer").classList.add("darkmode");
        for (let i = 0; i < table.length; i++) {
            table[i].classList.add("darkmode");
        }
        dark = true;
    }
    else {
        document.getElementById("dark").src = "dark.png";
        document.documentElement.classList.remove("darkmode");
        document.getElementById("title").classList.remove("darkmode");
        document.getElementById("turn").classList.remove("darkmode");
        document.getElementById("footer").classList.remove("darkmode");
        for (let i = 0; i < table.length; i++) {
            table[i].classList.remove("darkmode");
        }
        dark = false;
    }
}
function postTurn(side) {
    if (side === 'x') {
        if (host) {
            document.getElementById("turn").textContent = "Opponents turn";
            document.getElementById("game").style.cursor = "not-allowed";
            onlineSide = "o"
        }
        else {
            document.getElementById("turn").textContent = "Your turn";
            document.getElementById("game").style.cursor = "url(xCursor.png), auto"
            onlineSide = "x"
        }
        turn = side;
    }
    else if (side === 'o') {
        if (host) {
            document.getElementById("turn").textContent = "Your turn";
            document.getElementById("game").style.cursor = "url(oCursor.png), auto"
            onlineSide = "o"
        }
        else {
            document.getElementById("turn").textContent = "Opponents turn";
            document.getElementById("game").style.cursor = "not-allowed";
            onlineSide = "x"
        }
        turn = side;
    }
}
function postMark(tableIndex, squareIndex) {
    if (turn === "o") {
        createMark(tableIndex, squareIndex,"O");
    }
    else {
        createMark(tableIndex, squareIndex,"X")
    }
    updateTurn(tableIndex, squareIndex);
}