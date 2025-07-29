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