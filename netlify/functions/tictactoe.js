exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method Not Allowed" }) };
  }

  try {
    const { board, player } = JSON.parse(event.body);

    // ✅ Your Impossible AI logic here (minimax)
    function minimax(newBoard, isMaximizing) {
      const winner = checkWinner(newBoard);
      if (winner !== null) {
        if (winner === player) return { score: 10 };
        else if (winner === "draw") return { score: 0 };
        else return { score: -10 };
      }

      const moves = [];
      for (let i = 0; i < newBoard.length; i++) {
        if (!newBoard[i]) {
          newBoard[i] = isMaximizing ? player : (player === "X" ? "O" : "X");
          const result = minimax(newBoard, !isMaximizing);
          moves.push({ index: i, score: result.score });
          newBoard[i] = null;
        }
      }

      if (isMaximizing) {
        return moves.reduce((best, move) => move.score > best.score ? move : best, moves[0]);
      } else {
        return moves.reduce((best, move) => move.score < best.score ? move : best, moves[0]);
      }
    }

    function checkWinner(b) {
      const winPatterns = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]
      ];
      for (const [a,bIdx,c] of winPatterns) {
        if (b[a] && b[a] === b[bIdx] && b[a] === b[c]) return b[a];
      }
      if (!b.includes(null)) return "draw";
      return null;
    }

    const bestMove = minimax(board, true).index;

    return {
      statusCode: 200,
      body: JSON.stringify({ bestMove })
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};