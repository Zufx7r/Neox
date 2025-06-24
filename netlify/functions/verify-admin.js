const { Client } = require('pg');
const bcrypt = require('bcryptjs');

// Load env vars for local testing (optional)
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

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
      return { statusCode: 401, body: 'Invalid username' };
    }

    const user = res.rows[0];
    const isValid = await bcrypt.compare(password, user.password);

    if (isValid) {
      return { statusCode: 200, body: JSON.stringify({ success: true }) };
    } else {
      return { statusCode: 401, body: 'Incorrect password' };
    }
  } catch (err) {
    console.error('Login error:', err);
    return { statusCode: 500, body: 'Server error' };
  } finally {
    await client.end();
  }
};