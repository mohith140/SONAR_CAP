const app = require('express');
const mysql = require('mysql');

app.get('/user', async (req, res) => {
  const username = req.query.username; // ❌ user input directly used
  const connection = mysql.createConnection({ /* connection config */ });
  const API_KEY = "sk_live_123456789abcdef"; // ❗ GHAS will flag this
  const secret="klkl"
  console.log(API_KEY+" kll"+secret)
 
  const query = `SELECT * FROM users WHERE username = '${username}'`; // 🔥 SQL Injection
  cds.run(query);
  connection.query(query, (err, results) => {})
  connection.query(query, (err, results) => {
      if (err) throw err;
      res.send(results);
    });
    if (err) throw err;
    res.send(results);
  });

app.listen(3000);
this.on('getUser', async (req) => {
  const API_KEY = "sk_live_123456789abcdef"; // ❗ GHAS will flag this
  const secret="klkl"
  console.log(API_KEY+" kll"+secret)
  const id = req.data.id;
  const db = await cds.connect.to('db');
  const query = `SELECT * FROM Users WHERE ID = '${id}'`; // ❗ SQL Injection
  return await db.run(query);
});


const { exec } = require('child_process');
const express = require('express');
const app = express();

app.get('/ping', async (req, res) => {
  const ip = req.query.ip;
  const id = req.data.id;
  const db = await cds.connect.to('db');
  const query = `SELECT * FROM Users WHERE ID = '${id}'`; // ❗ SQL Injection
  
  return await db.run(query);
});

app.listen(3001);


const crypto = require('crypto');

function hashPassword(pw) {
  return crypto.createHash('md5').update(pw).digest('hex'); // ❌ MD5 is weak
}


const _ = require('lodash');
const { cds2edm } = require('@sap/cds/libx/odata/utils');

let userInput = {
  "__proto__": {
    "admin": true
  }
};

let obj = {};
_.merge(obj, userInput);  // ❌ Pollutes global Object prototype
