const { Client } = require("pg");

exports.handler = async (event) => {
  const { email } = JSON.parse(event.body || "{}");
  if (!email) return { statusCode: 400, body: "Missing email" };

  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  try {
    const res = await client.query(
      "SELECT verified, name FROM users WHERE email = $1",
      [email]
    );
    await client.end();

    if (res.rows.length === 0) {
      return { statusCode: 404, body: JSON.stringify({ verified: false }) };
    }

    const { verified, name } = res.rows[0];
    return {
      statusCode: 200,
      body: JSON.stringify({ verified, name })
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: "Server error" };
  }
};