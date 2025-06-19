// ✅ 1. netlify/functions/chat.js const { Client } = require('pg');

exports.handler = async (event) => { const client = new Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

if (event.httpMethod === 'POST') { const { name, text } = JSON.parse(event.body); if (!name || !text) return { statusCode: 400, body: 'Missing name or text' };

try {
  await client.connect();
  const result = await client.query(
    'INSERT INTO messages (name, text, timestamp) VALUES ($1, $2, NOW()) RETURNING id',
    [name, text]
  );
  await client.end();
  return {
    statusCode: 200,
    body: JSON.stringify({ success: true, id: result.rows[0].id })
  };
} catch (err) {
  console.error(err);
  return { statusCode: 500, body: JSON.stringify({ error: 'DB Insert Failed' }) };
}

}

if (event.httpMethod === 'GET') { try { await client.connect(); const result = await client.query('SELECT * FROM messages ORDER BY timestamp ASC LIMIT 100'); await client.end(); return { statusCode: 200, body: JSON.stringify(result.rows) }; } catch (err) { console.error(err); return { statusCode: 500, body: JSON.stringify({ error: 'DB Read Failed' }) }; } }

return { statusCode: 405, body: 'Method Not Allowed' }; };

// ✅ 2. netlify/functions/delete-message.js const { Client } = require("pg");

exports.handler = async (event) => { const id = event.queryStringParameters?.id; if (!id) return { statusCode: 400, body: "Missing message ID" };

const client = new Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

try { await client.connect(); const result = await client.query("DELETE FROM messages WHERE id = $1", [id]); await client.end();

if (result.rowCount === 1) {
  return { statusCode: 200, body: "Deleted" };
} else {
  return { statusCode: 404, body: "Message not found" };
}

} catch (err) { console.error("DB Error:", err); return { statusCode: 500, body: "Internal Server Error" }; } };

// ✅ 3. Update live-chat.html <script> /* inside <script> tag of live-chat.html */

const name = localStorage.getItem("name"); const user = localStorage.getItem("user"); if (!name || !user) window.location.href = "login.html";

document.getElementById("welcomeText").textContent = Welcome, ${name};

const input = document.getElementById("messageInput"); const chatBox = document.getElementById("chatBox");

async function loadMessages() { const res = await fetch("/.netlify/functions/chat"); const messages = await res.json(); messages.forEach(addMessage); }

function addMessage(msg) { const msgElem = document.createElement("div"); msgElem.className = "message";

const time = new Date(msg.timestamp); const timeStr = time.toLocaleString();

msgElem.innerHTML = <strong>${msg.name}</strong>: ${msg.text} <span class="timestamp">${timeStr}</span>;

if (msg.name === name && msg.id) { const delBtn = document.createElement("button"); delBtn.textContent = "×"; delBtn.onclick = async () => { const res = await fetch(/.netlify/functions/delete-message?id=${msg.id}, { method: "DELETE" }); if (res.ok) msgElem.remove(); else alert("Failed to delete message"); }; msgElem.appendChild(delBtn); }

chatBox.appendChild(msgElem); chatBox.scrollTop = chatBox.scrollHeight; }

async function sendMessage() { const text = input.value.trim(); if (!text) return;

const res = await fetch("/.netlify/functions/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, text }) });

const result = await res.json(); if (res.ok) { addMessage({ name, text, timestamp: new Date().toISOString(), id: result.id }); input.value = ""; } else { alert("Message failed to send"); } }

loadMessages();

