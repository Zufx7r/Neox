const { Client } = require("pg");

exports.handler = async (event) => {
  const { token } = JSON.parse(event.body || "{}");

  if (!token) {
    return { statusCode: 400, body: "Token missing" };
  }

  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  try {
    const res = await client.query(
      "UPDATE users SET verified = true, verify_token = NULL WHERE verify_token = $1 RETURNING *",
      [token]
    );

    await client.end();

    if (res.rowCount === 0) {
      return { statusCode: 400, body: "Invalid or expired token" };
    }

    return { statusCode: 200, body: "Your email has been successfully verified!" };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: "Server error" };
  }
};