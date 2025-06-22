const { Pool } = require("pg");
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

exports.handler = async (event) => {
  const { token } = JSON.parse(event.body);
  const res = await pool.query("SELECT email FROM users WHERE verify_token=$1", [token]);

  if (res.rowCount === 0) {
    return { statusCode: 400, body: JSON.stringify({ success: false }) };
  }

  const email = res.rows[0].email;
  await pool.query("UPDATE users SET is_verified=true, verify_token=NULL WHERE email=$1", [email]);

  return {
    statusCode: 200,
    body: JSON.stringify({ success: true, email })
  };
};