const { Client } = require('pg');
const bcrypt = require('bcryptjs');

exports.handler = async (event) => {
  const { username, password } = JSON.parse(event.body);

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();

    const res = await client.query('SELECT * FROM admins WHERE username = $1', [username]);

    if (res.rows.length === 0) {
      console.log("❌ Username not found");
      return { statusCode: 401, body: 'Invalid username' };
    }

    const user = res.rows[0];
    console.log("✅ Found user:", user.username);

    const isValid = await bcrypt.compare(password, user.password);
    console.log("🔐 Password match:", isValid);

    if (isValid) {
      return { statusCode: 200, body: JSON.stringify({ success: true }) };
    } else {
      return { statusCode: 401, body: 'Incorrect password' };
    }
  } catch (err) {
    console.error('❗ Server error:', err);
    return { statusCode: 500, body: 'Server error' };
  } finally {
    await client.end();
  }
};