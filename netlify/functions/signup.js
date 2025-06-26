lconst { Client } = require("pg");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

exports.handler = async (event) => {
  const { name, email, password } = JSON.parse(event.body);

  if (!name || !email || !password) {
    return {
      statusCode: 400,
      body: JSON.stringify({ success: false, error: "Missing required fields." }),
    };
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const verificationToken = crypto.randomBytes(32).toString("hex");

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
      );
    `);

    await client.query(
      `INSERT INTO users (name, email, password, verification_token) VALUES ($1, $2, $3, $4)`,
      [name, email.toLowerCase(), hashedPassword, verificationToken]
    );

    // Send verification email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const verificationUrl = `https://neoxsite.netlify.app/verify.html?token=${verificationToken}`;

    await transporter.sendMail({
      from: `"Neox Site" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify your email",
      html: `<p>Hi ${name},</p>
             <p>Click below to verify your email:</p>
             <a href="${verificationUrl}">${verificationUrl}</a>`,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: err.message }),
    };
  } finally {
    await client.end();
  }
};