// chat.js

const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

exports.handler = async (event) => {
  if (event.httpMethod === 'POST') {
    const { name, text } = JSON.parse(event.body);
    if (!name || !text) return { statusCode: 400, body: 'Missing name or text' };

    try {
      await client.connect();
      await client.query('INSERT INTO messages (name, text, timestamp) VALUES ($1, $2, NOW())', [name, text]);
      await client.end();
      return { statusCode: 200, body: JSON.stringify({ success: true }) };
    } catch (err) {
      console.error(err);
      return { statusCode: 500, body: JSON.stringify({ error: 'DB Insert Failed' }) };
    }
  }

  if (event.httpMethod === 'GET') {
    try {
      await client.connect();
      const res = await client.query('SELECT * FROM messages ORDER BY timestamp ASC LIMIT 100');
      await client.end();
      return {
        statusCode: 200,
        body: JSON.stringify(res.rows),
      };
    } catch (err) {
      console.error(err);
      return { statusCode: 500, body: JSON.stringify({ error: 'DB Read Failed' }) };
    }
  }

  return { statusCode: 405, body: 'Method Not Allowed' };
};