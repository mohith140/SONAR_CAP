const express = require('express');
const mysql = require('mysql');
const app = express();

app.get('/user', (req, res) => {
  const username = req.query.username; // ❌ user input directly used
  const connection = mysql.createConnection({ /* connection config */ });

  const query = `SELECT * FROM users WHERE username = '${username}'`; // 🔥 SQL Injection
  connection.query(query, (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});

app.listen(3000);


const { exec } = require('child_process');
const express = require('express');
const app = express();

app.get('/ping', (req, res) => {
  const ip = req.query.ip;
  exec(`ping -c 4 ${ip}`, (error, stdout, stderr) => {  // ❌ vulnerable
    if (error) return res.send(`Error: ${stderr}`);
    res.send(stdout);
  });
});

app.listen(3001);


const crypto = require('crypto');

function hashPassword(pw) {
  return crypto.createHash('md5').update(pw).digest('hex'); // ❌ MD5 is weak
}


const _ = require('lodash');

let userInput = {
  "__proto__": {
    "admin": true
  }
};

let obj = {};
_.merge(obj, userInput);  // ❌ Pollutes global Object prototype
