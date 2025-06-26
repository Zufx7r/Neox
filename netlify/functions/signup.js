exports.handler = async (event) => {
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      success: true, // ← required for your JS
      email_user: process.env.EMAIL_USER || "❌ Missing",
      email_pass: process.env.EMAIL_PASS ? "✅ Exists" : "❌ Missing"
    }),
  };
};