exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed",
    };
  }

  try {
    const { board, player } = JSON.parse(event.body);

    // Bot is always the opposite
    const bot = player === "X" ? "O" : "X";

    // Minimax AI
    function checkWin(current, state) {
      const patterns = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]
      ];
      return patterns.some(p => p.every(i => state[i] === current));
    }

    function minimax(state, depth, isMax) {
      if (checkWin(bot, state)) return 10 - depth;
      if (checkWin(player, state)) return depth - 10;
      if (state.every(c => c)) return 0;

      if (isMax) {
        let best = -Infinity;
        for (let i = 0; i < 9; i++) {
          if (!state[i]) {
            state[i] = bot;
            best = Math.max(best, minimax(state, depth+1, false));
            state[i] = '';
          }
        }
        return best;
      } else {
        let best = Infinity;
        for (let i = 0; i < 9; i++) {
          if (!state[i]) {
            state[i] = player;
            best = Math.min(best, minimax(state, depth+1, true));
            state[i] = '';
          }
        }
        return best;
      }
    }

    let bestScore = -Infinity;
    let bestMove = null;
    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        board[i] = bot;
        let score = minimax(board, 0, false);
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
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid input", details: err.message }),
    };
  }
};