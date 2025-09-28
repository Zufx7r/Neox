// netlify/functions/tictactoe.js
exports.handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: "Method Not Allowed" }),
      };
    }

    const { board, player } = JSON.parse(event.body);

    if (!board || !Array.isArray(board)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid board" }),
      };
    }

    // AI player symbol
    const ai = player;
    const opponent = ai === "X" ? "O" : "X";

    // Check winner helper
    function checkWin(boardState, symbol) {
      const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6],
      ];
      return winPatterns.some(pattern =>
        pattern.every(index => boardState[index] === symbol)
      );
    }

    // Minimax implementation
    function minimax(boardState, depth, isMax) {
      if (checkWin(boardState, ai)) return 10 - depth;
      if (checkWin(boardState, opponent)) return depth - 10;
      if (boardState.every(cell => cell !== '')) return 0;

      if (isMax) {
        let best = -Infinity;
        for (let i = 0; i < 9; i++) {
          if (boardState[i] === '') {
            boardState[i] = ai;
            best = Math.max(best, minimax(boardState, depth + 1, false));
            boardState[i] = '';
          }
        }
        return best;
      } else {
        let best = Infinity;
        for (let i = 0; i < 9; i++) {
          if (boardState[i] === '') {
            boardState[i] = opponent;
            best = Math.min(best, minimax(boardState, depth + 1, true));
            boardState[i] = '';
          }
        }
        return best;
      }
    }

    // Best move search
    let bestScore = -Infinity;
    let bestMove = null;
    for (let i = 0; i < 9; i++) {
      if (board[i] === '') {
        board[i] = ai;
        const score = minimax(board, 0, false);
        board[i] = '';
        if (score > bestScore) {
          bestScore = score;
          bestMove = i;
        }
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ bestMove }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};