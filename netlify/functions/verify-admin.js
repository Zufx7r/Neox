const { Client } = require('pg');
const bcrypt = require('bcryptjs');

exports.handler = async (event) => {
  const { username, password } = JSON.parse(event.body);

  const client = new Client({
    connectionString: 'postgres://USER:PASSWORD@HOST:PORT/DATABASE',
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
    return { statusCode: 500, body: 'Server error' };
  } finally {
    await client.end();
  }
};