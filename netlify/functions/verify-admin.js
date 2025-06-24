const { Client } = require('pg');
const bcrypt = require('bcryptjs');

exports.handler = async (event) => {
  const { username, password } = JSON.parse(event.body);

  console.log("Login attempt:", username, password);

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();

    const result = await client.query('SELECT * FROM admins WHERE username = $1', [username]);

    if (result.rows.length === 0) {
      console.log("❌ No user found.");
      return { statusCode: 401, body: 'Invalid username' };
    }

    const user = result.rows[0];
    console.log("✅ User found:", user.username);

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("🔐 Password valid:", isMatch);

    if (isMatch) {
      return { statusCode: 200, body: JSON.stringify({ success: true }) };
    } else {
      return { statusCode: 401, body: 'Incorrect password' };
    }
  } catch (error) {
    console.error("Server error:", error);
    return { statusCode: 500, body: 'Server error' };
  } finally {
    await client.end();
  }
};