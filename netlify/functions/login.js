const { Client } = require("pg");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed",
    };
  }

  const { email, password } = JSON.parse(event.body);
  const client = new Client({ connectionString: process.env.DATABASE_URL });

  try {
    await client.connect();
    const result = await client.query(
      "SELECT name FROM users WHERE email = $1 AND password = $2",
      [email, password]
    );
    await client.end();

    if (result.rows.length === 1) {
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true, name: result.rows[0].name }),
      };
    } else {
      return {
        statusCode: 401,
        body: JSON.stringify({ success: false, message: "Invalid email or password" }),
      };
    }
  } catch (err) {
    console.error("Login error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: "Server error" }),
    };
  }
};