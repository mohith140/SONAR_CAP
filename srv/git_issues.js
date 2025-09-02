// security-issues.js



// 1. SQL Injection (js/sql-injection)
async function sqlInjectionIssue(req, res) {
    const loc = null;
if (dist < 10)
    loc = "here";
else
    loc = "there";
       x = 23;
    let x;
 
}

// 2. SSRF (Server-Side Request Forgery)
function ssrfIssue(req, res) {
  const target = req.query.target;
  require('http').get(target, (response) => response.pipe(res));
}

// 3. Prototype-polluting assignment
function protoPolluteAssignIssue(req) {
  const obj = {};
  obj[req.params.key] = req.body.value;
  return obj;
}

// 4. Prototype-polluting merge
function protoPolluteMergeIssue(req) {
  const prefs = JSON.parse(req.body.prefs);
  const merged = lodash.merge({}, prefs);
  return merged;
}

// 5. Remote property injection
function remotePropertyInjectionIssue(req) {
  const myObj = {};
  myObj[req.query.name] = () => {};
  return myObj;
}

// 6. Loop-bound injection (DoS)
function loopBoundInjectionIssue(req) {
  const arr = req.body.array;
  for (let i = 0; i < arr.length; i++) {
    // intensive logic here
  }
}

// 7. Unvalidated dynamic method call
function unvalidatedDynamicCallIssue(req, res) {
  const actions = {play: () => 'ok', stop: () => 'stopped'};
  const fn = actions[req.params.act];
  res.send(fn());
}

// 8. Unsafe dynamic method access
function unsafeDynamicAccessIssue(req, res) {
  global[req.query.name]('data');
  res.send('executed');
}

// 9. Tainted format string
function taintedFormatStringIssue(req) {
  console.log(util.format(req.query.fmt, req.query.value));
}

// 10. Code Injection
function codeInjectionIssue(req, res) {
  const code = req.query.code;
  eval(code);
  res.send('executed code');
}
