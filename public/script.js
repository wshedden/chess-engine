var config = {
    position: "start",
    draggable: true,
    dropOffBoard: "snapback",
}
var board = Chessboard('board', config);
var socket = io.connect('http://localhost:3000');
