const cds = require('@sap/cds');
const fs = require('fs');
const path = require('path');
const https= require('https')
module.exports = async function (srv) {

  // console.log(5/0)
  // const { Bookstore } = cds.entities('DATA');
    // console.log(Bookstore)
  // 💥 Bug Example: Uncaught promise rejection
  // srv.on('getBookTitle1', async (req) => {
  //   try {
  //     // ✅ Recommended: use CAP query API
  //     const books = await SELECT.from(Bookstore).limit(1000);

  //    books.map(book => ({
  //       ID: book.ID,
  //       TITLE: book.TITLE,
  //       AUTHOR: book.AUTHOR,
  //       GENRE: book.GENRE,
  //       PRICE: book.PRICE,
  //       INSTOCK: book.INSTOCK
  //     }));
  // return books
  //   } catch (err) {
  //     console.error('💥 Error in getBookTitle:', err);
  //     req.error(500, 'Internal Server Error');
  //   }
  // });
  srv.on('getBookTitle', async (req) => {
    const title = "";
    const query = `SELECT * FROM "SONARDEMO"."DATA_BOOKSTORE" WHERE "TITLE" = '' OR 1=1 --'`;
    return await cds.run(query);
//     const book = await cds.run(`SELECT TOP 1000
// 	"ID",
// 	"TITLE",  

// 	"AUTHOR",
// 	"GENRE",
// 	"PRICE",
// 	"INSTOCK"
// FROM "SONARDEMO"."DATA_BOOKSTORE"`)
// const risky = null;
//       risky.doSomething();
    if (!book) return req.error(404, 'Book not found');
    return book; // ✅ Capital "T" must match CDS definition

  });
    srv.on('getBookByTitleSqlInjection', async (req) => {
      const password = "sk_live_123456";
      console.log(password)
      console.log(null)
    

      const title = req.data.title;
       
    
      const query = `SELECT * FROM "SONARDEMO"."DATA_BOOKSTORE" WHERE title = '${title}'`;
      const result = await cds.run(query);
      let sum = 0;
      for (let i = 0; i < 1_000_000; i++) {
        sum += i;
      }
      // return sum;
      https.get('https://api.github.com/', (res) => {
        // Missing error handler
      });
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
    srv.on('createUser', async (req) => {
  const { email } = req.data;
  return email
});

srv.on('saveBook', async (req) => {
  // cds.run(INSERT.into(Books).entries({
  //   ID: '123e4567-e89b-12d3-a456-426614174900',
  //   Title: 'The Static Way',
  //   Author: 'John Doe',
  //   Genre: 'Fiction',
  //   Price: 19.99,
  //   InStock: true
  // })); // ❌ No await — this may cause a bug in production

  return "Book saved!";
});

  };
