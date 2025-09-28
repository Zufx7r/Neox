// netlify/functions/tictactoe.js
exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const { board, player } = JSON.parse(event.body);

  // ✅ Your AI logic here (replace with your existing AI)
  function getBestMove(board, player) {
    // Example: random move (replace with minimax/AI code)
    const emptyIndices = board
      .map((v, i) => (v === "" ? i : null))
      .filter(v => v !== null);

    const choice = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    return choice;
  }

  const bestMove = getBestMove(board, player);

  return {
    statusCode: 200,
    body: JSON.stringify({ bestMove }),
    headers: { "Content-Type": "application/json" }
  };
};