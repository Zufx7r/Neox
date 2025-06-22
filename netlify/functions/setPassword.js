const { Pool } = require("pg");
const bcrypt = require("bcryptjs");
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

exports.handler = async (event) => {
  const { email, password } = JSON.parse(event.body);
  const hash = await bcrypt.hash(password, 10);

  await pool.query("UPDATE users SET password=$1 WHERE email=$2 AND is_verified=true", [hash, email]);

  return {
    statusCode: 200,
    body: JSON.stringify({ success: true, message: "Password set. You can now login." })
  };
};