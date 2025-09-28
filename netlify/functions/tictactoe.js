// netlify/functions/tictactoe.js
exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  try {
    const { board, player, difficulty } = JSON.parse(event.body);
    const bot = player === "X" ? "O" : "X";

    // ---------- AI LOGIC ----------
    function checkWin(board, current) {
      const winPatterns = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]
      ];
      return winPatterns.some(p => p.every(i => board[i] === current));
    }

    function minimax(boardState, depth, isMax) {
      if (checkWin(boardState, bot)) return 10 - depth;
      if (checkWin(boardState, player)) return depth - 10;
      if (boardState.every(cell => cell !== "")) return 0;

      if (isMax) {
        let best = -Infinity;
        for (let i = 0; i < 9; i++) {
          if (boardState[i] === "") {
            boardState[i] = bot;
            best = Math.max(best, minimax(boardState, depth + 1, false));
            boardState[i] = "";
          }
        }
        return best;
      } else {
        let best = Infinity;
        for (let i = 0; i < 9; i++) {
          if (boardState[i] === "") {
            boardState[i] = player;
            best = Math.min(best, minimax(boardState, depth + 1, true));
            boardState[i] = "";
          }
        }
        return best;
      }
    }

    function bestMove() {
      let bestScore = -Infinity;
      let move;
      for (let i = 0; i < 9; i++) {
        if (board[i] === "") {
          board[i] = bot;
          let score = minimax(board, 0, false);
          board[i] = "";
          if (score > bestScore) {
            bestScore = score;
            move = i;
          }
        }
      }
      return move;
    }

    // ---------- Difficulty ----------
    let move;
    const available = board.map((v, i) => v === "" ? i : null).filter(i => i !== null);

    if (difficulty === "easy") {
      move = available[Math.floor(Math.random() * available.length)];
    } else if (difficulty === "hard") {
      if (Math.random() > 0.5) {
        move = bestMove();
      } else {
        move = available[Math.floor(Math.random() * available.length)];
      }
    } else {
      move = bestMove(); // impossible
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ bestMove: move }),
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};