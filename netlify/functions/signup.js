const { Client } = require("pg");
const bcrypt = require("bcryptjs");

exports.handler = async (event) => {
  let { name, email, password } = JSON.parse(event.body);

  if (!name || !email || !password) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing required fields." }),
    };
  }

  email = email.toLowerCase(); // ✅ Normalize email

  const hashedPassword = bcrypt.hashSync(password, 10);

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();

    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT,
        email TEXT UNIQUE,
        password TEXT,
        email_verified BOOLEAN DEFAULT FALSE,
        verification_token TEXT
      )
    `);

    await client.query(
      `INSERT INTO users (name, email, password)
       VALUES ($1, $2, $3)`,
      [name, email, hashedPassword]
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