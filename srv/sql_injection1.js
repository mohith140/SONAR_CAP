const cds = require('@sap/cds');

module.exports = cds.service.impl(async function () {

  // ❌ VULNERABLE: SQL injection via string interpolation
  this.on('getUserById', async (req) => {
    const id = req.data.id; // 🟥 user-controlled input
    const db = await cds.connect.to('db');

    const query = `SELECT * FROM Users WHERE ID = '${id}'`; // ⚠️ Vulnerable to SQL Injection
    const result = await db.run(query); // 🔥 CodeQL should flag this

    return result;
  });

  // ❌ VULNERABLE: Another SQL injection scenario
  this.on('searchBooksByTitle', async (req) => {
    const { title } = req.data;

    const query = `SELECT * FROM Books WHERE Title LIKE '%${title}%'`; // ⚠️ Unsanitized input in LIKE clause
    const books = await cds.run(query); // 🔥 Flagged by CodeQL

    return books;
  });

  // ✅ SECURE example for comparison
  this.on('secureGetUser', async (req) => {
    const id = req.data.id;
    const user = await SELECT.from('Users').where({ ID: id }); // ✅ No injection risk
    return user;
  });

});
