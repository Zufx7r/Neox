const { Client } = require('@neondatabase/serverless');

exports.handler = async (event) => {
  const { email, password } = JSON.parse(event.body);
  const client = new Client({ connectionString: process.env.DATABASE_URL });

  await client.connect();
  const res = await client.query(
    'SELECT * FROM users WHERE email = $1 AND password = $2',
    [email, password]
  );

  await client.end();

  if (res.rows.length > 0) {
    return { statusCode: 200, body: JSON.stringify({ login: true }) };
  } else {
    return { statusCode: 401, body: JSON.stringify({ login: false }) };
  }
};