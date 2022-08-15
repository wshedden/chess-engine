import express from "express";
import calculateMove from "./chessAI.js";
import { Server } from "socket.io";
import { Chess } from "chess.js";

var app = express();
const PORT = process.env.PORT || 3000;
var server = app.listen(PORT, "0.0.0.0");
var games = Object();

const io = new Server(server);

function setup() {
  app.use(express.static("public"));
  console.log("Server is running on port " + process.env.PORT);
  socketSetup();
}

function socketSetup() {
  io.listen(8000);

  io.on("connection", (socket) => {
    console.log("Connected with id", socket.id);
    games[socket.id] = Chess();

    socket.on("move", (move) => {
      let valid = makeMove(move, games[socket.id]);
      socket.emit("boardUpdate", games[socket.id].fen(), valid);
    });

    socket.on("opponentMoveRequest", () => {
        console.log("Requesting move");
        makeAImove(games[socket.id]);
        socket.emit("boardUpdate", games[socket.id].fen(), false);
      });
  });
}

function makeMove(move, game) {
  return game.move(move) != null;
}

function makeAImove(game) {
    let move = calculateMove(game);
    
    game.move(move.move);
    console.log("Evaluation: " + move.score)
}




setup();


//DONE TODO: handle multiple boards
//DONE TODO: stop it from automatically making a move if it's not your turn
//TODO: handle checkmate