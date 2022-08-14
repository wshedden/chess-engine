import { Chess } from 'chess.js'

function alphabeta(chess, depth, alpha, beta, isMaximizing){
    if (depth === 0) {
        return {score: getScoreEstimate(chess), move: null};
    }

    if(isMaximizing) {
        let bestMove = null;
        let bestScore = -Infinity;
        const moves = chess.moves();
        for (let i = 0; i < moves.length; i++) {
            const move = moves[i];
            chess.move(move);
            const score = alphabeta(chess, depth - 1, alpha, beta, false).score;
            chess.undo();
            if (score > bestScore) {
                bestScore = score;
                bestMove = move;
            }
            if (score > alpha) {
                alpha = score;
            }
            if (alpha >= beta) {
                break;
            }
        }
        return {score: bestScore, move: bestMove};
    } else {
        let bestMove = null;
        let bestScore = Infinity;
        const moves = chess.moves();
        for (let i = 0; i < moves.length; i++) {
            const move = moves[i];
            chess.move(move);
            const score = alphabeta(chess, depth - 1, alpha, beta, true).score;
            chess.undo();
            if (score < bestScore) {
                bestScore = score;
                bestMove = move;
            }
            if (score < beta) {
                beta = score;
            }
            if (alpha >= beta) {
                break;
            }
        }
        return {score: bestScore, move: bestMove};
    }
}

function getScoreEstimate(chess) {
    // Count material advantage
    if(chess.in_checkmate()) {
        if(chess.turn() === 'w') {
            return -Infinity;
        } else {
            return Infinity;
        }
    }

    let score = 0;
    for (let i = 0; i < chess.board().length; i++) {
        for (let j = 0; j < chess.board()[i].length; j++) {
            if (chess.board()[i][j] != null) {
                let square = chess.board()[i][j];
                let pieceValue = getPieceValue(square.type);
                score += pieceValue * (square.color == 'w' ? 1 : -1);
            }
        }
    }
    return score;
}

function getPieceValue(piece) {
    switch (piece) {
        case 'p':
            return 1;
        case 'n':
            return 3;
        case 'b':
            return 3;
        case 'r':
            return 5;
        case 'q':
            return 9;
        case 'k':
            return 1000;
        default:
            return 0;
    }
}

export default alphabeta;