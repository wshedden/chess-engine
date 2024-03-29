// var socket = io.connect("http://localhost:3000");
var socket = io();

function onDrop(source, target) {
  var move = {
    from: source,
    to: target,
    promotion: "q",
  };

  if (move === null) return "snapback";
  socket.emit("move", move);
  return "";
}

function onDragStart(source, piece, position, orientation) {
    if(piece[0] === 'b') {
        return false;
    }
}

function setup() {
  var config = {
    position: "start",
    draggable: true,
    dropOffBoard: "snapback",
    onDrop: onDrop,
    onDragStart: onDragStart,
  };

  var board = Chessboard("board", config);

  socket.on("boardUpdate", (fen, isPlayerMove) => {
    board.position(fen);
    if(isPlayerMove) {
        socket.emit("opponentMoveRequest");
    }
  });
}

setup();