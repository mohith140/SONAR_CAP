const cds = require('@sap/cds');
const app = require("express")()
module.exports =async function (srv) {
 const nodemailer = require("nodemailer");
 
  srv.on("updateEntry",async (req)=> { 
    const category=req.params.category;
   var query1 =
    "SELECT ITEM,PRICE FROM SHOP WHERE ITEM_CATEGORY='" +
    category +
    "' ORDER BY PRICE";
    const result = await cds.run(query1);
    console.log(result);
 })


// 2. Cross-Site Scripting (XSS) (CWE-79)
srv.on("addComment", async (req) => {
  if (!isValidUserId(req.params.id)) {
    // Directly inserting untrusted user input into response (BAD ❌)
    res.send("Unknown user: " + req.params.id);
  } else {
    res.send("Welcome back user " + req.params.id);
  }
});

// 3. Cross-Site Request Forgery (CSRF) (CWE-352)
srv.on("updateProfile", async (req) => {
  // no CSRF protection check
  return cds.run(UPDATE("Profiles").set(req.data).where({ ID: req.user.id }));
});

// 4. Authentication Bypass (CWE-287)
srv.on("deleteUser", async (req) => {
  // no authentication enforced
  return cds.run(DELETE.from("Users").where({ ID: req.data.id }));
});

// 5. Broken Access Control (CWE-284)
srv.on("getAllUsers", async (req) => {
  // everyone can access all users
  return cds.run(SELECT.from("Users"));
});

// 6. Insecure Direct Object Reference (IDOR) (CWE-639)
srv.on("getInvoice", async (req) => {
  // does not check if user owns invoice
  return cds.run(SELECT.from("Invoices").where({ ID: req.data.id }));
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

// 10. Security Misconfiguration (CWE-933)
srv.on("openAdmin", async () => {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; // disables TLS verification
  return "Admin opened insecurely";
});

// 11. Broken Session Management (CWE-384)
srv.on("reuseSession", async (req) => {
  req._.session.id = "HARDCODED_SESSION"; // predictable / reused session
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

// 14. Unvalidated Redirects and Forwards (CWE-601)
srv.on("redirectUser", async (req, res) => {
  const { url } = req.data;
  res.redirect(url); // unvalidated user-controlled redirect
});

// 15. API Rate Limiting Issues (CWE-770)
srv.on("expensiveOp", async () => {
  // no throttling, can be abused with unlimited calls
  return Array(1000000).fill("expensive");
});

// 16. Improper File Upload Handling (CWE-434)
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
    await cds.run(SELECT.from("NonExistent"));
  } catch (err) {
    console.log("Error: " + err); // logs full stack trace, no monitoring
  }
});

// 20. Lack of HTTPS / SSL (CWE-311)
srv.on("callInsecureAPI", async () => {
  const axios = require("axios");
  return axios.get("http://insecure-api.com/data"); // no HTTPS
});

}; 