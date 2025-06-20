const { Client } = require("pg");
const nodemailer = require("nodemailer");

exports.handler = async (event) => {
  const { email, name } = JSON.parse(event.body || "{}");

  if (!email || !name) {
    return { statusCode: 400, body: "Missing email or name" };
  }

  // Generate a fake verification token (in real case you'd store it and use UUID)
  const token = Math.random().toString(36).substring(2, 15);

  const verifyLink = `https://neoxsite.netlify.app/verify.html?token=${token}`;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: email,
      subject: "Verify your email - Neox",
      html: `<h2>Hello ${name},</h2>
             <p>Click the link below to verify your email:</p>
             <a href="${verifyLink}">${verifyLink}</a>
             <br><p>Thanks,<br>Neox Team</p>`
    });

    // Save token to Neon (optional — depends if you're verifying)
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();
    await client.query("UPDATE users SET verify_token = $1 WHERE email = $2", [token, email]);
    await client.end();

    return { statusCode: 200, body: "Verification email sent" };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: "Failed to send email" };
  }
};