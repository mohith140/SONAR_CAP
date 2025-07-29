const cds = require('@sap/cds');
const mysql = require('mysql');
const fs = require('fs');
const { exec } = require('child_process');

module.exports = cds.service.impl(async function () {
  this.on('getUserById', async (req) => {
    const id = req.data.id;
    const db = await cds.connect.to('db');

    // 🚨 SQL Injection Vulnerability
    const query = `SELECT * FROM Users WHERE ID = '${id}'`;
    const result = await db.run(query);
    return result;
  });

  this.on('dangerousCommand', async (req) => {
    const userCommand = req.data.cmd;

    // 🚨 Command Injection
    exec(userCommand, (err, stdout, stderr) => {
      if (err) {
        console.error('Execution error:', err);
        return;
      }
      console.log('Command output:', stdout);
    });
    return "Command executed";
  });

  this.on('readSecrets', async () => {
    // 🚨 Hardcoded secret
    const secretKey = "sk_test_1234567890abcdef";

    return { secretKey };
  });

  this.on('evaluateInput', async (req) => {
    const input = req.data.expression;

    // 🚨 Dangerous use of eval
    const result = eval(input);
    return { result };
  });

  this.on('readFile', async (req) => {
    const filename = req.data.filename;

    // 🚨 Insecure file access (Path Traversal risk)
    const data = fs.readFileSync(`./files/${filename}`, 'utf8');
    return { content: data };
  });

  this.on('mysqlQuery', async (req) => {
    const username = req.data.username;

    // 🚨 Raw SQL Query with user input
    const connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'root',
      database: 'test'
    });

    connection.connect();

    const query = `SELECT * FROM users WHERE username = '${username}'`;
    connection.query(query, (err, results) => {
      if (err) throw err;
      console.log(results);
    });

    connection.end();
    return { status: 'Query executed' };
  });
});

