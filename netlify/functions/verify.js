const { Client } = require("pg");

exports.handler = async (event) => {
  const token = event.queryStringParameters.token;

  if (!token) {
    return {
      statusCode: 400,
      body: "❌ Missing token.",
    };
  }

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();

    const result = await client.query(
      `UPDATE users
       SET email_verified = TRUE, verification_token = NULL
       WHERE verification_token = $1
       RETURNING email`,
      [token]
    );

    if (result.rowCount === 1) {
      return {
        statusCode: 200,
        body: "✅ Email verified. You may now log in.",
      };
    } else {
      return {
        statusCode: 400,
        body: "❌ Invalid or expired verification link.",
      };
    }
  } catch (err) {
    return {
      statusCode: 500,
      body: "❌ Server error: " + err.message,
    };
  } finally {
    await client.end();
  }
};