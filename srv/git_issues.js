const cds = require('@sap/cds');
const { exec } = require('child_process');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const http = require('http');

module.exports = async function (srv) {

  // === Example READ handler with multiple vulnerabilities ===
  srv.on('READ', 'VulnerableEntity', async (req) => {
    let input = req.data.input || "";
    if (/(?:start|end)(\[*|\{*)abc\2:(.*)/.test(input))
	console.log("Found the pattern.");
    // === 1. Hardcoded Secret ===
    const GITHUB_TOKEN = "ghp_1234567890abcdef1234567890abcdef1234";
    console.log("Using token:", GITHUB_TOKEN);

    // === 2. Insecure eval() ===
    const userInput = req.data.code || "2 + 2";
    const result = eval(userInput); // ⚠️ Insecure
    console.log("Eval result:", result);

    // === 3. Command Injection ===
    const cmdInput = req.data.cmd || "ls";
    exec(`bash -c "${cmdInput}"`, (err, stdout, stderr) => {
      if (err) {
        console.error("Command error:", err);
      } else {
        console.log("Command output:", stdout);
      }
    });

    // === 4. SQL Injection ===
    const db = new sqlite3.Database(':memory:');
    const sqlInput = req.data.name || "'; DROP TABLE users; --";
    db.run("SELECT * FROM users WHERE name = '" + sqlInput + "'", (err) => {
      if (err) console.error("SQL Error:", err);
    });

    // === 5. Insecure HTTP ===
    http.get("http://example.com", (res) => {
      console.log("HTTP response status:", res.statusCode);
    });

    // === 6. Unsafe Deserialization ===
    const payload = req.data.payload || '{"admin":true}';
    const obj = eval('(' + payload + ')'); // ⚠️ Insecure
    console.log("Deserialized object:", obj);

    // === 7. Path Traversal ===
    const filePath = req.data.path || "../etc/passwd";
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      console.log("File content:", content);
    } catch (e) {
      console.error("File read error:", e.message);
    }

    return [{ message: "Vulnerabilities triggered (for testing only)" }];
  });

};
