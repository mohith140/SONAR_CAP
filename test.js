// This is a dummy credential - SonarCloud should flag it as a security hotspot


console.log(eval('5/0'))
var x=5/0;
console.log(x)
var t=21;
// 1. Division by zero (suspicious math)
const result = 10 / 0;
console.log("Result:", result);

// 2. Unused variable (code smell)
let unusedVar = 42;

// 3. Null dereference (runtime bug)
let obj = null;
console.log(obj.property); // causes TypeError

// 4. Use of == instead of === (bug-prone comparison)
if ('5' == 5) {
  console.log("Loose equality detected");
}

// 5. Duplicate condition
if (true) {
  console.log("First branch");
} else if (true) {
  console.log("Unreachable code");
}

// 6. Unreachable code
return;
console.log("I am unreachable!");

// 7. Hardcoded credentials (security hotspot)
const password = "P@ssw0rd123";

// 8. Function with too many parameters (code smell)
function doEverything(a, b, c, d, e, f, g) {
  return a + b;
}

// 9. Empty catch block (security/code smell)
try {
  throw new Error("Oops");
} catch (e) {
  // nothing here
}

// 10. Eval usage (security hotspot)
eval("console.log('This is unsafe')");
