

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

