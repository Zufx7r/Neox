exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed",
      headers: { "Content-Type": "text/plain" }
    };
  }

  const { board, player } = JSON.parse(event.body);

  // … run AI logic …

  return {
    statusCode: 200,
    body: JSON.stringify({ bestMove }),
    headers: { "Content-Type": "application/json" }
  };
};