const cds = require('@sap/cds');
const fs = require('fs');
const path = require('path');
module.exports = async function (srv) {
  const { Bookstore } = cds.entities('DATA');
    console.log(Bookstore)
  // 💥 Bug Example: Uncaught promise rejection
  srv.on('testNodeMailer1', async (req) => {
    try {
    const nodemailer = require("nodemailer");

// Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "mohithsai309@gmail.com",
    pass: "Mohith@2312180",
  },
});

// Wrap in an async IIFE so we can use await.

  const info = await transporter.sendMail({
    from: '"Maddison Foo Koch" <mohithsai309@gmail.com>',
    to: "mohithbunny79@gmail.com",
    subject: "Hello ✔",
    text: "Hello world?", // plain‑text body
    html: "<b>Hello world?</b>", // HTML body
  });

  console.log("Message sent:", info.messageId);
    } catch (err) {
      console.error('💥 Error in getBookTitle:', err);
      req.error(500, 'Internal Server Error');
    }
  });
  this.on('getBookTitle', async (req) => {
    const book = await cds.run(`SELECT TOP 1000
	"ID",
	"TITLE",
	"AUTHOR",
	"GENRE",
	"PRICE",
	"INSTOCK"
FROM "SONARDEMO"."DATA_BOOKSTORE"`)
    if (!book) return req.error(404, 'Book not found');
    return book; // ✅ Capital "T" must match CDS definition

  });
    srv.on('getBookByTitleSqlInjection', async (req) => {
      // SONAR_CUSTOM: Triggering custom rule check
System.out.println("This should use a logger");

      const title = req.data.title;
  
      // ❌ Dangerous: injecting user input directly into SQL
      const query = `SELECT * FROM "SONARDEMO"."DATA_BOOKSTORE" WHERE title = '${title}'`;
      const result = await cds.run(query);
   
      return result;
    });


srv.on('readFileInsecure', async (req) => {
  try {
    const filePath = path.join(__dirname, '../sonar.http');

    // ❌ Resource leak: no close() called
    const stream = fs.createReadStream(filePath);

    let data = '';
    for await (const chunk of stream) {
      data += chunk;
    }

    return { content: data };
  } catch (err) {
    console.error('💥 Error in readFileInsecure:', err);
    req.error(500, 'File Read Failed');
  }
});

  };
  


// Dummy async function that always rejects
async function simulateExternalFailure(data) {
    console.log("I am from Books")
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Simulated service failure')), 100);
  });
}
