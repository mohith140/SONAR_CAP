const cds = require('@sap/cds');
const fs = require('fs');
const path = require('path');
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
      console.log(5/0)
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
