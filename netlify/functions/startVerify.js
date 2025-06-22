// /.netlify/functions/startVerify.js
const { v4: uuidv4 } = require("uuid");
const nodemailer = require("nodemailer");
const { Pool } = require("pg");
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

exports.handler = async (event) => {
  const { email } = JSON.parse(event.body);
  const token = uuidv4();

  await pool.query(`
    INSERT INTO users (email, is_verified, verify_token)
    VALUES ($1, false, $2)
    ON CONFLICT (email)
    DO UPDATE SET verify_token = $2, is_verified = false
  `, [email, token]);

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: 587,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  await transporter.sendMail({
    from: `"Neox Site" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Verify your email",
    html: `<p>Click to verify:</p>
           <a href="https://neoxsite.netlify.app/verify.html?token=${token}">Verify Email</a>`
  });

  return {
    statusCode: 200,
    body: JSON.stringify({ success: true, message: "Verification email sent." })
  };
};