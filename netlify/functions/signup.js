exports.handler = async (event) => {
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email_user: process.env.EMAIL_USER || "❌ EMAIL_USER not set",
      email_pass: process.env.EMAIL_PASS ? "✅ Exists" : "❌ Missing",
    }),
  };
};