// srv/service.js
const express = require('express');
const mysql = require('mysql');
const axios = require('axios'); 
const { exec } = require('child_process');
const app = express();

app.use(express.json()); 

// 🔐 Issue 1: Hardcoded Secret (CWE-798)
const jwtSecret = 'superSecretKey1234567890';

// 🛑 Issue 2: SQL Injection (CWE-89)
app.get('/user', (req, res) => {
  const userId = req.query.id;
  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'testdb'
  });
  connection.connect();
  const query = `SELECT * FROM users WHERE id = '${userId}'`; // Unsafe
  connection.query(query, (err, result) => {
    if (err) res.status(500).send(err.message);
    else res.json(result);
  });
  connection.end();
});

// ⚠️ Issue 3: Command Injection (CWE-77)
app.get('/ping', (req, res) => {
  const ip = req.query.ip;
  exec(`ping -c 3 ${ip}`, (err, stdout, stderr) => {
    if (err) res.status(500).send(stderr);
    else res.send(`<pre>${stdout}</pre>`);
  });
});

// 🚨 Issue 4: Unsafe eval (CWE-95)
app.post('/run', (req, res) => {
  const code = req.body.code;
  const result = eval(code); // Dangerous
  res.send(`Result: ${result}`);
});

// 🧨 Issue 5: Unvalidated Redirect (CWE-601)
app.get('/redirect', (req, res) => {
  const target = req.query.url;
  res.redirect(target); // Unchecked URL
});

// 🌍 Issue 6: Untrusted Data to External API (CWE-020)
app.get('/proxy', (req, res) => {
  const url = req.query.url;
  axios.get(url)
    .then(response => res.send(response.data))
    .catch(err => res.status(500).send(err.message));
});

// 🧱 Issue 7: Incomplete Sanitization Using substring (CWE-020)
app.get('/fetch-item', (req, res) => {
  const item = req.query.item;
  const url = 'https://api.example.com/items/' + item.substring(0, 5); // Weak validation
  axios.get(url)
    .then(r => res.send(r.data))
    .catch(e => res.status(500).send(e.message));
});

// 🥷 Issue 8: Missing Origin Check Before Action (CWE-346)
app.post('/callback', (req, res) => {
  const data = req.body;
  // No origin check
  handleCallback(data);
  res.send('Callback received');
});

function handleCallback(data) {
  console.log('Handling external callback:', data);
}

// 🕸️ Issue 9: Insecure CORS Policy (CWE-942)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Overly permissive
  next();
});

// 🔎 Issue 10: Logging Sensitive Data (CWE-532)
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  console.log(`Login attempt: ${username} / ${password}`); // Logs secrets
  res.send('Login attempt logged');
});

app.listen(3000, () => {
  console.log('Service running on port 3000');
});
