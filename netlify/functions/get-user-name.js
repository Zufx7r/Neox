const { Client } = require('pg');

exports.handler = async (event) => {
  const email = event.queryStringParameters?.email;
  if (!email) return { statusCode: 400, body: "Missing email" };

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    const res = await client.query("SELECT name FROM users WHERE email = $1", [email]);
    await client.end();

    if (res.rows.length > 0) {
      return {
        statusCode: 200,
        body: JSON.stringify({ name: res.rows[0].name })
      };
    } else {
      return { statusCode: 404, body: "User not found" };
    }
  } catch (err) {
    console.error("DB Error:", err);
    return { statusCode: 500, body: "DB Error" };
  }
};