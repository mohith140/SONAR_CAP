const cds = require('@sap/cds');
const fs = require('fs');
const path = require('path');
module.exports = async function (srv) {
  const { Bookstore } = cds.entities('DATA');
    console.log(Bookstore)
  // 💥 Bug Example: Uncaught promise rejection
 
    srv.on('getBookByTitleSqlInjection', async (req) => {
      const title = req.data.title;
  
      // ❌ Dangerous: injecting user input directly into SQL
      const query = `SELECT * FROM "SONARDEMO"."DATA_BOOKSTORE" WHERE title = '${title}'`;
      const result = await cds.run(query);
   
      return result;
    });



  };
  


// Dummy async function that always rejects
async function simulateExternalFailure(data) {
    console.log("I am from Books")
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Simulated service failure')), 100);
  });
}
// test/service.test.js

// ✅ Make sure the service file is executed
require('./srv/service');

describe('Dummy handler test', () => {
  it('should pass this placeholder test', () => {
    expect(true).toBe(true);
  });
});
