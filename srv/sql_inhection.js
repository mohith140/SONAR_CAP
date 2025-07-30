// srv/service.js
const cds = require('@sap/cds');
module.exports =async function (srv) {
// 🔐 Issue 1: Hardcoded Secret (CWE-798)
const jwtSecret = 'superSecretKey1234567890';

// 🛑 Issue 2: SQL Injection (CWE-89)
srv.on('/user', (req) => {
  const userId = req.query.id;
  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'testdb'
  });
  connection.connect();
  const query = `SELECT * FROM users WHERE id = '${userId}'`; // Unsafe
  connection.query(query, (err, result) => {
    if (err) res.status(500).send(err.message);
    else res.json(result);
  });
  connection.end();
});

// ⚠️ Issue 3: Command Injection (CWE-77)
srv.on('/ping', (req) => {
  const ip = req.query.ip;
  exec(`ping -c 3 ${ip}`, (err, stdout, stderr) => {
    if (err) res.status(500).send(stderr);
    else res.send(`<pre>${stdout}</pre>`);
  });
});

// 🚨 Issue 4: Unsafe eval (CWE-95)
srv.before('/run', (req) => {
  const code = req.body.code;
  const result = eval(code); // Dangerous
  res.send(`Result: ${result}`);
});

// 🧨 Issue 5: Unvalidated Redirect (CWE-601)
srv.on('/redirect', (req) => {
  const target = req.query.url;
  res.redirect(target); // Unchecked URL
});

// 🌍 Issue 6: Untrusted Data to External API (CWE-020)
srv.on('/proxy', (req) => {
  const url = req.query.url;
  axios.get(url)
    .then(response => res.send(response.data))
    .catch(err => res.status(500).send(err.message));
});

// 🧱 Issue 7: Incomplete Sanitization Using substring (CWE-020)
srv.on('/fetch-item', (req) => {
  const item = req.query.item;
  const url = 'https://api.example.com/items/' + item.substring(0, 5); // Weak validation
  axios.get(url)
    .then(r => res.send(r.data))
    .catch(e => res.status(500).send(e.message));
});

// 🥷 Issue 8: Missing Origin Check Before Action (CWE-346)
srv.on('/callback', (req) => {
  const data = req.body;
  // No origin check
  handleCallback(data);
  res.send('Callback received');
});

function handleCallback(data) {
  console.log('Handling external callback:', data);
}

// 🕸️ Issue 9: Insecure CORS Policy (CWE-942)


// 🔎 Issue 10: Logging Sensitive Data (CWE-532)
srv.on('/login', (req) => {
  const { username, password } = req.body;
  console.log(`Login attempt: ${username} / ${password}`); // Logs secrets
  res.send('Login attempt logged');
});


}