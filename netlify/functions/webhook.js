let logs = [];

exports.handler = async (event) => {
  const headers = {
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "POST") {
    let body;
    try {
      body = JSON.parse(event.body);
    } catch {
      body = event.body;
    }

    const id = Date.now(); // unique ID for each log
    logs.push({ id, time: new Date().toISOString(), data: body });

    if (logs.length > 50) logs.shift(); // keep last 50

    return { statusCode: 200, headers, body: JSON.stringify({ success: true, id }) };
  }

  // DELETE = delete logs
  if (event.httpMethod === "DELETE") {
    const { id } = event.queryStringParameters || {};

    if (id === "all") {
      logs = [];
      return { statusCode: 200, headers, body: JSON.stringify({ success: true, msg: "All deleted" }) };
    }

    if (id) {
      logs = logs.filter(log => log.id != id);
      return { statusCode: 200, headers, body: JSON.stringify({ success: true, msg: `Deleted ${id}` }) };
    }

    return { statusCode: 400, headers, body: JSON.stringify({ success: false, msg: "No id provided" }) };
  }

  // GET = return logs
  return { statusCode: 200, headers, body: JSON.stringify(logs) };
};