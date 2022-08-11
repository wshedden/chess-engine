import { Chess } from 'chess.js'

function playGame(){
    const chess = new Chess()
    while (!chess.game_over()) {
        const moves = chess.moves()
        const move = moves[Math.floor(Math.random() * moves.length)]
        chess.move(move)
    }
    console.log(chess.pgn());
}
export default playGame;