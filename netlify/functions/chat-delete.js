const { Client } = require("pg");

exports.handler = async (event) => {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  const id = event.queryStringParameters.id;
  if (!id) return { statusCode: 400, body: "Missing id" };

  try {
    await client.connect();
    await client.query("DELETE FROM messages WHERE id = $1", [id]);
    await client.end();
    return { statusCode: 200, body: "Deleted" };
  } catch (err) {
    console.error("Delete failed:", err);
    return { statusCode: 500, body: "DB Delete Failed" };
  }
};