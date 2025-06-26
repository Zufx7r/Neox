const { Client } = require("pg");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

return {
  statusCode: 200,
  body: JSON.stringify({
    email_user: process.env.EMAIL_USER,
    email_pass: process.env.EMAIL_PASS ? "Exists ✅" : "Missing ❌"
  }),
};
exports.handler = async (event) => {
  let { name, email, password } = JSON.parse(event.body);

  if (!name || !email || !password) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing required fields." }),
    };
  }

  email = email.toLowerCase();
  const hashedPassword = bcrypt.hashSync(password, 10);
  const token = crypto.randomBytes(32).toString("hex");

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();

    await client.query(`
      INSERT INTO users (name, email, password, verification_token)
      VALUES ($1, $2, $3, $4)
    `, [name, email, hashedPassword, token]);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const verifyLink = `https://neoxsite.netlify.app/verify.html?token=${token}`;

    await transporter.sendMail({
      from: `"Neox Site" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify your email",
      html: `<p>Hello ${name},</p>
             <p>Click the link to verify your email:</p>
             <a href="${verifyLink}">${verifyLink}</a>`,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: "Verification email sent." }),
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