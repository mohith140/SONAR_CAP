const cds = require('@sap/cds');
const app = require("express")();
const fs = require('fs');
var http = require("http");
const url = require("url");
const axios = require('axios');
const crypto = require("crypto");
app.use(require('body-parser').urlencoded({ extended: false }))
module.exports =async function (srv) {
 const nodemailer = require("nodemailer");
 let url = 'http://example.org/auth';
let username = 'user';
let password = 'passwd';
 //1.sql injection            ---(done)
  srv.on("updateEntry",async (req)=> { 
    const category=req.params.category;
   var query1 =
    "SELECT ITEM,PRICE FROM SHOP WHERE ITEM_CATEGORY='" +
    category +
    "' ORDER BY PRICE";
    const result = await cds.run(query1);
    console.log(result+" "+password);
 })


// 2. Cross-Site Scripting (XSS) (CWE-79)      ---(partially done)
srv.on('/user/:id', async (req,res) => {
const name = req.query.name; // user-controlled input
    // ❌ Unsafe: reflected directly into response
    res.send(`Hello, ${name}! Welcome to our site.`);
        var href = document.location.href,
        deflt = href.substring(href.indexOf("default=")+8);
    
    try {
        var parsed = unknownParseFunction(deflt); 
    } catch(e) {
        document.write("Had an error: " + e + "."); //  ---(done)
    }
    //
     fs.readdir('/public', function (error, fileNames) {
        var list = '<ul>';
        fileNames.forEach(fileName => {
            // BAD: `fileName` can contain HTML elements
            list += '<li>' + fileName + '</li>';
        });
        list += '</ul>'
        res.send(list);
    });
    
});

// 3. Cross-Site Request Forgery (CSRF) (CWE-352)
srv.on("updateProfile", async (req) => {
  // no CSRF protection check
  const result=cds.run(UPDATE("Profiles").set(req.data).where({ ID: req.user.id }));
  return result;
});

// 4. Authentication Bypass (CWE-287)
srv.on("deleteUser", async (req) => {
  // no authentication enforced
  const result=cds.run(`DELETE FROM Users WHERE ID = ${req.data.user.id}`);
  return result;
});

// 5. Broken Access Control (CWE-284)
srv.on("getAllUsers", async (req) => {
  // everyone can access all users
  return cds.run(`SELECT * FROM Users`);
});

// 6. Insecure Direct Object Reference (IDOR) (CWE-639)
srv.on("getInvoice", async (req) => {
  // does not check if user owns invoice
  return cds.run(`SELECT * FROM Invoices WHERE ID = ${req.data.invoice.id}`);
});

// 7. Insecure Deserialization (CWE-502)
srv.on("deserializeData", async (req) => {
  const { serialized } = req.data;
  return JSON.parse(serialized); // untrusted JSON parsed directly
});

// 8. Command Injection (CWE-77)
srv.on("runSystemCommand", async (req) => {
  const { cmd } = req.data;
  const { exec } = require("child_process");
  exec(cmd, (err, stdout) => console.log(stdout)); // vulnerable
  return "Executed";
});

// 9. Sensitive Data Exposure (CWE-200)
srv.on("debugUser", async (req) => {
  const user = await cds.run(SELECT.one.from("Users").where({ ID: req.data.id }));
  return user; // returns password, tokens, etc. without filtering
});

// 10. Security Misconfiguration (CWE-933)   ---(done)
srv.on("openAdmin", async () => {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; // disables TLS verification
  return "Admin opened insecurely";
});

// 11. Broken Session Management (CWE-384)
srv.on("reuseSession", async (req) => {
  req._.session.id = "jjhjhjhjjhbhgvgfvjbhgvgvgvhvghvhbh "; // predictable / reused session
  return "Session reused";
});

// 12. Clickjacking (CWE-1021)
srv.on("getPage", async () => {
  // no X-Frame-Options header set
  return "<html><body><h1>Important Page</h1></body></html>";
});

// 13. Insecure CORS Configuration (CWE-346)
srv.on("openData", async (_, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // allows all origins
  return { data: "open" };
});

// 14. Unvalidated Redirects and Forwards (CWE-601)   ---(done)
srv.on("redirectUser", async (req, res) => {
  const { url } = req.data;
  window.location = /.*redirect=([^&]*).*/.exec(document.location.href)[1];
  res.redirect(req.query["target"]);
  res.redirect(url); // unvalidated user-controlled redirect
});

// 15. API Rate Limiting Issues (CWE-770)
srv.on("expensiveOp", async (req,res) => {
  // no throttling, can be abused with unlimited calls
  	var size = parseInt(url.parse(req.url, true).query.size);

	let dogs = new Array(size).fill("dog"); // BAD
   	var size = parseInt(url.parse(req.url, true).query.size);

	let buffer = Buffer.alloc(size); // BAD
console.log(dog+" "+buffer)
	// ... use the buffer
  return Array(1000000).fill("expensive");
});

// 16. Improper File Upload Handling (CWE-434)     ---(done)
srv.on("uploadFile", async (req) => {
  const { file } = req.data;
  require("fs").writeFileSync(`/tmp/${file.name}`, file.content); // no type validation
  return "Uploaded";
});

// 17. Hardcoded Secrets in Code (CWE-798)
srv.on("connectDB", async () => {
  const dbUser = "admin";
  const dbPass = "SuperSecret123"; // hardcoded secret
  return `Connected with ${dbUser}/${dbPass}`;
});

// 18. Outdated Dependencies (CWE-1104)
srv.on("legacyLib", async () => {
  const crypto = require("crypto"); // example of weak MD5 usage
  return crypto.createHash("md5").update("test").digest("hex"); // outdated hashing
});

// 19. Improper Logging & Monitoring (CWE-778)
srv.on("logError", async (req) => {
  try {
    await cds.run('SELECT * FROM USER');
  } catch (err) {
    console.log("Error: " + err); // logs full stack trace, no monitoring
  }
});

// 20. Lack of HTTPS / SSL (CWE-311)
srv.on("callInsecureAPI", async (req,res) => {
  const axios = require("axios");
  return axios.get("http://insecure-api.com/data"); // no HTTPS
});

// 21. Command injection / SSL (CWE-78)
srv.on("commmandInjection", async (req,res) => {
  cp.execSync(`wc -l ${file}`);
    let file = url.parse(req.url, true).query.path;

    cp.execSync(`wc -l ${file}`); // BAD
});

// 22. improper input validation / SSL (CWE-20) /82    --(done)
srv.on("inputValidation", async (req,res) => {
let url = req.param("url"),
        host = urlLib.parse(url).host;
    // BAD: the host of `url` may be controlled by an attacker
    if (host.includes("example.com")) {
        res.redirect(url);
    }
});
//23. empty password configuration  cwe:862
srv.on("emptyPassword", async (req,res) => {
    const { username, password } = req.body;

    // ❌ No check for empty passwords or proper authentication
    if (username) {
        // ✅ User exists, but...
        // ❌ Missing proper password check
        return res.send(`Logged in as ${username}`);
    }

    return res.status(401).send('Unauthorized');
});

  srv.on('logPassword', async (req) => {
    const password = req.data.password;

    // 7. Sensitive data exposure (Medium)
    console.log(`Password received: ${password}`);
    return "Logged";
  });
    srv.on('logPassword', async (req) => {
    var hasher = crypto.createHash('md5');
    var hashed = hasher.update(password).digest("hex"); // BAD
    return hashed;
  });
    srv.on('queryParameters', async (req) => {
        const user = req.query.user;
    const password = req.query.password;
    if (checkUser(user, password)) {
        res.send('Welcome');
    } else {
        res.send('Access denied');
    }
  });
    srv.on('hashSecure', async (req) => {
    var hasher = crypto.createHash('md5');
    var hashed = hasher.update(password).digest("hex"); // BAD
    return hashed;
  });
// 🔎 Issue 24: Logging Sensitive Data (CWE-532)
srv.on('/login', (req) => {
let url = 'http://example.org/auth';
let username = 'user';
let password = 'passwd';
let admin_password="";
let headers = new Headers();

headers.append('Content-Type', 'text/json');
headers.append('Authorization', 'Basic' + username + ":" + password+" "+admin_password);

fetch(url, {
          method:'GET',
          headers: headers
       })
.then(response => response.json())
.then(json => console.log(json))
.done();
}); 
}; 