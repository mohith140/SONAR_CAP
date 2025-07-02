const cds = require('@sap/cds');
const fs = require('fs');
const path = require('path');
module.exports = async function (srv) {
 
    srv.on('getBookByTitleSqlInjection', async (req) => {
      const title = req.data.title;
  
      // ❌ Dangerous: injecting user input directly into SQL
      const query = `SELECT * FROM "SONARDEMO"."DATA_BOOKSTORE" WHERE title = '${title}'`;
      const result = await cds.run(query);
   
      return result;
    });


}
