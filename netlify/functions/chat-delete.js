const { Client } = require("pg");

exports.handler = async (event) => {
  const id = event.queryStringParameters?.id;
  if (!id) return { statusCode: 400, body: "Missing message ID" };

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    const result = await client.query("DELETE FROM messages WHERE id = $1", [id]);
    await client.end();

    if (result.rowCount === 1) {
      return { statusCode: 200, body: "Deleted" };
    } else {
      return { statusCode: 404, body: "Message not found" };
    }
  } catch (err) {
    console.error("DB Error:", err);
    return { statusCode: 500, body: "Internal Server Error" };
  }
};