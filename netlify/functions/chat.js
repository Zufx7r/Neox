const { Client } = require("pg");

exports.handler = async (event) => {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  if (event.httpMethod === "POST") {
    const { name, text } = JSON.parse(event.body);
    if (!name || !text) return { statusCode: 400, body: "Missing name or text" };

    try {
      await client.connect();
      const result = await client.query(
        "INSERT INTO messages (name, text, timestamp) VALUES ($1, $2, NOW()) RETURNING id",
        [name, text]
      );
      await client.end();
      return { statusCode: 200, body: JSON.stringify({ id: result.rows[0].id }) };
    } catch (err) {
      return { statusCode: 500, body: JSON.stringify({ error: "DB Insert Failed" }) };
    }
  }

  if (event.httpMethod === "GET") {
    try {
      await client.connect();
      const result = await client.query("SELECT * FROM messages ORDER BY timestamp ASC");
      await client.end();
      return { statusCode: 200, body: JSON.stringify(result.rows) };
    } catch (err) {
      return { statusCode: 500, body: JSON.stringify({ error: "DB Read Failed" }) };
    }
  }

  return { statusCode: 405, body: "Method Not Allowed" };
};