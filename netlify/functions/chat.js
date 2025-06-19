const { Client } = require('pg');

exports.handler = async (event) => {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false } // Needed for Neon
  });

  try {
    await client.connect();

    if (event.httpMethod === 'POST') {
      const { name, text } = JSON.parse(event.body);
      if (!name || !text) {
        await client.end();
        return { statusCode: 400, body: 'Missing name or text' };
      }

      await client.query(
        'INSERT INTO messages (name, text, timestamp) VALUES ($1, $2, NOW())',
        [name, text]
      );

      await client.end();
      return { statusCode: 200, body: JSON.stringify({ success: true }) };
    }

    if (event.httpMethod === 'GET') {
      const res = await client.query(
        'SELECT * FROM messages ORDER BY timestamp ASC LIMIT 100'
      );

      await client.end();
      return {
        statusCode: 200,
        body: JSON.stringify(res.rows),
      };
    }

    await client.end();
    return { statusCode: 405, body: 'Method Not Allowed' };
  } catch (err) {
    console.error('Database error:', err);
    try {
      await client.end();
    } catch (_) {}

    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'DB Query Failed', details: err.message }),
    };
  }
};