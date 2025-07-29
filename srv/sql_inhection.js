const app = require('express');
const mysql = require('mysql');

app.get('/user', async (req, res) =>{
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

app.listen(3000);
app.get('getUser', async (req) => {
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
