const peer = new Peer();

let activePeer = null
let host = false

peer.on('open', function(id) {
	console.log('My peer ID: ' + id);
    document.getElementById("peerId").placeholder = "My ID: " + id;
});

peer.on('connection', function(conn) {
    
    if (activePeer === null) {
        host = true
        connection(conn);
    }
    else if (activePeer !== conn) {
        console.log(conn.peer+" was kicked")
        conn.close();
    }
    
});

function connect() {
    document.getElementById("status").style.display = "inline";
    document.getElementById("status").src = 'loading.png';
    document.getElementById("status").style.animationName = 'rotate';
    let conn = peer.connect(document.getElementById("peerId").value);
    host = false;
    connection(conn);
}
function disconnect() {
    if (activePeer !== null) {
        activePeer.close();
    }
}
function connection(conn) {
    conn.on('open', function() {
        activePeer = conn;
        onlineReset();
        console.log("Connected with "+conn.peer);
        document.getElementById("status").style.display = "inline";
        document.getElementById("status").src = 'connected.png';
        document.getElementById("status").style.animationName = 'none';
        document.getElementById("connButton").disabled = true;
        if (host === true) {
            let newTurn = randomTurn();
            postTurn(newTurn);
            conn.send({
                'type': 'postTurn',
                'data': newTurn
            })
        }
        conn.on('close', function() {
            document.getElementById("status").src = 'disconnected.png';
            document.getElementById("connButton").disabled = false;
            document.getElementById("status").style.animationName = 'none';
            activePeer = null;
            finishedTable = [3,3,3,3,3,3,3,3,3];
            document.getElementById("turn").textContent = 'Opponent disconnected'
            document.getElementById("game").style.cursor = "not-allowed";
        });
        conn.on('data', function(data) {
            if (data['type'] === 'postTurn') {
                postTurn(data['data']);
            }
            if (data['type'] === 'postMark') {
                postMark(data['data'][0], data['data'][1]);
                
            }
        });
    });
}

function onlineReset() {
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
    focusUpdate();
}
function randomTurn() {
    rand = Math.round(Math.random());
    if (rand === 1) {
        return 'x';
    }
    else {
        return 'o';
    }
}
function copyId() {
	navigator.clipboard.writeText(peer.id);
	alert("Copied "+peer.id);
}