let logs = [];

exports.handler = async (event) => {
  if (event.httpMethod === "POST") {
    let body;

    try {
      body = JSON.parse(event.body);
    } catch {
      body = event.body;
    }

    logs.push({
      time: new Date().toISOString(),
      data: body
    });

    // limit logs to last 20
    if (logs.length > 20) logs.shift();

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };
  }

  // GET = return logs
  return {
    statusCode: 200,
    body: JSON.stringify(logs),
    headers: {
      "Content-Type": "application/json"
    }
  };
};