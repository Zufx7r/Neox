const { Client } = require("pg");

exports.handler = async (event) => {
  const { name, email, password } = JSON.parse(event.body);

  if (!name || !email || !password) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing required fields." }),
    };
  }

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();

    await client.query(
      `CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT,
        email TEXT UNIQUE,
        password TEXT
      )`
    );

    await client.query(
      `INSERT INTO users (name, email, password) VALUES ($1, $2, $3)`,
      [name, email, password]
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  } finally {
    await client.end();
  }
};