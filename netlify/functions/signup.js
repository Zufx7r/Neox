const { Client } = require('@neondatabase/serverless');

exports.handler = async (event) => {
  const { email, password } = JSON.parse(event.body);
  const client = new Client({ connectionString: process.env.DATABASE_URL });

  await client.connect();

  try {
    await client.query(
      'INSERT INTO users (email, password) VALUES ($1, $2)',
      [email, password]
    );
    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'User already exists' }),
    };
  } finally {
    await client.end();
  }
};