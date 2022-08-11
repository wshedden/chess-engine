import express from 'express';
var app = express();
var server = app.listen(process.env.PORT || 3000, '0.0.0.0');

app.use(express.static('public'));
console.log("Server is running on port " + process.env.PORT);

// const game = import('./playChess.js');
import playGame from './playChess.js';

import { Server } from "socket.io";
const io = new Server(server);
io.listen(8000);

io.on('connection', (socket)=> {
    console.log("Connected with id", socket.id);
    socket.on('movePiece', (move)=> {
        console.log(move);
    });
});

playGame();
