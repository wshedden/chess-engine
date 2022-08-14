var socket = io.connect("http://localhost:3000");

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

function setup() {
  var config = {
    position: "start",
    draggable: true,
    dropOffBoard: "snapback",
    onDrop: onDrop,
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