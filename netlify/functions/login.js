const { Client } = require("pg");
const bcrypt = require("bcryptjs");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed",
    };
  }

  let { email, password } = JSON.parse(event.body);
  email = email.toLowerCase(); // ✅ Normalize email input

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();

    const result = await client.query(
      "SELECT name, password FROM users WHERE email = $1",
      [email]
    );

    await client.end();

    if (result.rows.length === 1) {
      const user = result.rows[0];
      const isMatch = bcrypt.compareSync(password, user.password);

      if (isMatch) {
        return {
          statusCode: 200,
          body: JSON.stringify({ success: true, name: user.name }),
        };
      }
    }

    return {
      statusCode: 401,
      body: JSON.stringify({ success: false, message: "Invalid email or password" }),
    };
  } catch (err) {
    console.error("Login error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: "Server error" }),
    };
  }
};