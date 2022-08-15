import { Chess } from "chess.js";

function alphabeta(chess, depth, alpha, beta, isMaximizing) {
  if (depth === 0) {
    return { score: getScoreEstimate(chess), move: null };
  }

  if (isMaximizing) {
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
    return { score: bestScore, move: bestMove };
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
    return { score: bestScore, move: bestMove };
  }
}

function getScoreEstimate(chess) {
  // Count material advantage
  if (chess.in_checkmate()) {
    if (chess.turn() === "w") {
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
        score += pieceValue * (square.color == "w" ? 1 : -1);
      }
    }
  }
  return score;
}

function getPieceValue(piece) {
  switch (piece) {
    case "p":
      return 1;
    case "n":
      return 3;
    case "b":
      return 3;
    case "r":
      return 5;
    case "q":
      return 9;
    case "k":
      return 1000;
    default:
      return 0;
  }
}

function calculateMove(game) {
  let move = {move: mcts(game, 5000), score: null};
  console.log(move);
  return move;

    // let move = alphabeta(game, 3, -Infinity, Infinity, false);
    // console.log(move);
    // return move;
}

function mcts(game, millis) {
  let start = new Date().getTime();
  let root = new Node(game.fen());

  while (new Date().getTime() - start < millis) {
    console.log("Time: " + (new Date().getTime() - start));
    // Selection phase
    let leaf = selectLeaf(root);

    // Expansion phase
    let expanded = leaf.expand();

    // Simulation phase
    let winner = simulate(expanded);
    if (winner == "w") {
      leaf.incrementWins();
    } else if (winner == "b") {
      leaf.incrementLosses();
    } else {
      leaf.incrementDraws();
    }

    // Backpropagation phase
    let current = leaf;
    while (current != null) {
      current.incrementVisits();
      current = current.parent;
    }
  }
  // Pick node with most visits
  let bestNode = null;
  let bestVisits = -Infinity;
  for (let i = 0; i < root.children.length; i++) {
    if (root.children[i].visits > bestVisits) {
      bestNode = root.children[i];
      bestVisits = root.children[i].visits;
    }
  }
  return bestNode.move;
}

function selectLeaf(root) {
  let current = root;
  while (!current.isTerminal()) {
    let child = current.selectChild();
    if (child == null) {
      break;
    }
    current = child;
  }
  return current;
}

class Node {
  constructor(fen) {
    this.fen = fen;
    this.children = [];
    this.wins = 0;
    this.visits = 0;
    this.move = "";
    this.parent = null;
  }

  isTerminal() {
    return false;
  }

  selectChild() {
    let bestChild = null;
    let bestScore = -Infinity;
    for (let i = 0; i < this.children.length; i++) {
      const child = this.children[i];
      const score = child.getUCB1();
      if (score > bestScore) {
        bestScore = score;
        bestChild = child;
      }
    }
    return bestChild;
  }

  getUCB1() {
    // Check if this is correct
    return (
      this.wins / this.visits +
      Math.sqrt((2 * Math.log(this.parent.visits)) / this.visits)
    );
  }

  expand() {
    let child = new Node(this.fen);
    child.makeRandomMove();
    child.parent = this;
    this.children.push(child);
    return child;
  }

  incrementWins() {
    this.wins++;
  }
  incrementLosses() {
    this.losses++;
  }
  incrementDraws() {
    this.draws++;
  }
  incrementVisits() {
    this.visits++;
  }

  makeRandomMove() {
    let chess = new Chess(this.fen);
    let moves = chess.moves();
    this.move = moves[Math.floor(Math.random() * moves.length)];
    chess.move(this.move);
    this.fen = chess.fen();
  }
}

function simulate(node) {
  let chess = new Chess(node.fen);
  while (!chess.game_over()) {
    let moves = chess.moves();
    let move = moves[Math.floor(Math.random() * moves.length)];
    chess.move(move);
  }
  return chess.turn();
}

export default calculateMove;
