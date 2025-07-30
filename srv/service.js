const cds = require('@sap/cds');
const fs = require('fs');
const path = require('path');
const https= require('https')
module.exports =async function (srv) {
const crypto = require('crypto');
const child_process = require('child_process');
const vm = require('vm');
cds.User.default = cdsUser.Privileged;
const express = require('express');
const mysql = require('mysql');
const axios = require('axios');
const { exec } = require('child_process');
const app = express();

app.use(express.json()); 
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
    const id = req.data.id; // 🟥 Unvalidated user input
    const db =cds.connect.to('db');

    // ❌ SQL Injection using template string
    const q = `SELECT * FROM Customers WHERE ID = '${id}'`;

    // CodeQL should detect this line
    const result =db.run(q);

    return result;

  });
  srv.on('getUserById', async (req) => {
    const connection = mysql.createConnection({ /* connection config */ });

    const query1 = `SELECT * FROM users WHERE username = '${username}'`; // 🔥 SQL Injection
    cds.run(query1);
    connection.query(query1, (err, results) => {})
    const id = req.data.id; // 🚨 Unsafe
    const db = await cds.connect.to('db');

    // ⚠️ SQL injection vulnerability: directly injecting user input into query string
    const query = `SELECT * FROM Users WHERE ID = '${id}'`;

    const result = await db.run(query);
    return result;
  });
    srv.on('getBookByTitleSqlInjection', async (req) => {
      
      const password = "sk_live_123456";
      console.log(password)
      console.log(null)
    

      const title = req.data.title;
       
    
      const sql_query = `SELECT * FROM "SONARDEMO"."DATA_BOOKSTORE" WHERE title = '${title}'`;
     
      const result = await cds.run(`SELECT * FROM "SONARDEMO"."DATA_BOOKSTORE" WHERE ID = '${title}'`);
      const result1=await SELECT.from(Bookstore).where({ title });
      const userInput = req.data.title;
const query1 = `SELECT * FROM BOOKS WHERE title = '${userInput}'`;  // ⚠️ string concatenation
const result2=await cds.run(sql_query);

      // let sum = 0;
      // for (let i = 0; i < 1_000_000; i++) {
      //   sum += i;
      // }
      // // return sum;
      // https.get('https://api.github.com/', (res) => {
      //   // Missing error handler
      // });

      return result2;
// const sql = "SELECT * FROM Books WHERE title = " + title ;
// await db.execute( "SELECT * FROM Books WHERE title = " + title +""); // Use something Sonar understands like raw SQL or a generic exec
// await db.execute( "SELECT * FROM Books WHERE title = " + title )
// await mycon.query( "SELECT * FROM Books WHERE title = " + title ,(err, res) => {})
// const mysql = require('mysql');
// const mycon = mysql.createConnection({ host: host, user: user, password: pass, database: db });
// mycon.connect(function(err) {
//   mycon.query('SELECT * FROM users WHERE id = ' + title, (err, res) => {}); // Sensitive
// });
// return db.query(query); 
    
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
//Security Hotspots

 // 1. Weak hash (MD5)
 srv.on('weakHash', async () => {
 
  return crypto.createHash('md5').update('input').digest('hex');
});

// 2. Use of eval
srv.on('useEval', async (req) => {
  return eval("2 + 2");
});

// 3. Dangerous RegExp (ReDoS potential)
srv.on('badRegex', async (req) => {
  const id = req.data.id; // ⚠️ user-controlled input
  const db = await cds.connect.to('db');
  const regex = new RegExp('(a+)+$');
  const t=regex.test('aaaaaaaaaaaaaaaaaaaaaaaaaaaa!');
  const query = `SELECT * FROM Users WHERE ID = '${id}'`; // 🚨 Unsafe
  return await db.run(query); 
});

// 4. Insecure random generator (Math.random)
srv.on('insecureRandom', () => {
  const token = Math.random().toString(36).substring(2);
  return token;
});

// 5. Insecure command execution
// srv.on('execDanger', async () => {
//   child_process.exec('ls', (err, stdout) => {
//     if (err) return 'fail';
//     return stdout;
//   });
// });

// 6. Leaking stack trace
srv.on('leakError', async () => {
  try {
    throw new Error('Sensitive stack');
  } catch (err) {
    return err.stack;
  }
});

// 7. Disabling cert validation

srv.on('getUserById', async (req) => {
  const id = req.data.id; // ⚠️ user-controlled input
  const db = await cds.connect.to('db');
  const query = `SELECT * FROM Users WHERE ID = '${id}'`; // 🚨 Unsafe
  return await db.run(query); // ✅ CodeQL will flag this
});

// 8. Insecure deserialization
srv.on('unsafeVM', async () => {
  const context = {};
  vm.createContext(context);
  return vm.runInContext("2 + 2", context);
});

// 9. Dangerous buffer usage
srv.on('unsafeBuffer', () => {
  const input = '100';
  return Buffer.allocUnsafe(parseInt(input)).toString();
});

// 10. Unrestricted CORS
srv.on('openCORS', () => {
  return {
    headers: { "Access-Control-Allow-Origin": "*" },
    status: 200
  };
});

// 11. Exposure of internal info
srv.on('exposeEnv', () => {
  return process.env;
});

// 12. Dangerous catch without sanitizing
srv.on('unsanitizedError', async () => {
  try {
    throw new Error("Sensitive DB error");
  } catch (e) {
    return e.message;
  }
});

// 13. Non-constant time comparison
srv.on('timingAttack', () => {
  const userInput = "pass";
  const real = "password";
  return userInput === real;
});

// 14. Exposure of server config
srv.on('configLeak', () => {
  return {
    os: process.platform,
    node: process.version,
    uptime: process.uptime()
  };
});

// 15. Excessive logging
srv.on('logSensitive', () => {
  const user = { email: "a@b.com", password: "secret" };
  console.log(user);
  return "logged";
});

// 16. Dynamic require
srv.on('dynamicRequire', async () => {
  const mod = 'fs';
  return require(mod);
});

// 17. Unprotected debug route
srv.on('debugDump', () => {
  return {
    memory: process.memoryUsage(),
    env: process.env
  };
});

// 18. Unsafe JSON parse
srv.on('unsafeJSON', () => {
  const input = "{ \"value\": 1 }";
  return JSON.parse(input);
});


// 19. Ignoring HTTPS in external call
// srv.on('httpRequest', async () => {
//   return new Promise((resolve, reject) => {
//     const req = http.get('http://example.com', (res) => {
//       let data = '';
//       res.on('data', chunk => data += chunk);
//       res.on('end', () => resolve(data));
//     });

//     req.on('error', (err) => {
//       console.error('HTTP request failed:', err.message);
//       resolve('fail'); // Don't reject, to avoid test crash
//     });
//   });
// });

// 20. Insecure setTimeout-based timing logic
srv.on('delayCompare', () => {
  const input = "test";
  if (input === "test") {
    setTimeout(() => console.log("matched"), 100);
  }
  return "done";
});
srv.on('insecureTLS', () => {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  return "Cert validation disabled";
});
};
