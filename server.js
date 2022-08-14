import express from "express";
import alphabeta from "./chessAI.js";
import { Server } from "socket.io";
import { Chess } from "chess.js";

var app = express();
var server = app.listen(process.env.PORT || 3000, "0.0.0.0");

const io = new Server(server);

function setup() {
  app.use(express.static("public"));
  console.log("Server is running on port " + process.env.PORT);
  var game = new Chess();
  socketSetup(game);
}

function socketSetup(game) {
  io.listen(8000);

  io.on("connection", (socket) => {
    console.log("Connected with id", socket.id);
    socket.on("move", (move) => {
      let valid = makeMove(move, game);
      socket.emit("boardUpdate", game.fen(), valid);
    });

    socket.on("opponentMoveRequest", () => {
        console.log("Requesting move");
        makeAImove(game);
        socket.emit("boardUpdate", game.fen(), false);
      });
  });
}

function makeMove(move, game) {
  return game.move(move) != null;
}

function makeAImove(game) {
    let move = alphabeta(game, 3, -Infinity, Infinity, false);
    game.move(move.move);
    console.log("Evaluation: " + move.score)
}




setup();


//TODO: handle multiple boards
//DONE TODO: stop it from automatically making a move if it's not your turn
//TODO: handle checkmate