const cds = require('@sap/cds');
const path = require('path');
const fs = require('fs');
const request = require('supertest');
const { describe, it, expect, beforeAll } = require('@jest/globals');
const crypto = require('crypto');
const child_process = require('child_process');
const vm = require('vm');

const mock = require('mock-fs');
var x=null;
jest.mock('@sap/cds');

describe('CAP Custom Handlers', () => {
  let srv;

  beforeEach(() => {
    srv = { on: jest.fn(), emit: jest.fn() };
    require('../srv/service')(srv);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('getBookTitle1: should return mocked books', async () => {
    const mockBooks = [
      { ID: 1, TITLE: 'Book A', AUTHOR: 'Author A', GENRE: 'Fiction', PRICE: 10.5, INSTOCK: true }
    ];

    const req1 = { data: { title: "' OR 1=1 --" } };
    const handler = srv.on.mock.calls.find(c => c[0] === 'getBookByTitleSqlInjection')[1];
    const result = await handler(req1);
    
    const fs = require('fs');
    


  });

  test('getBookTitle: should return SQL query result', async () => {
    const mockResult = [{ ID: 1, TITLE: 'Book A' }];
    cds.run = jest.fn().mockResolvedValue(mockResult);

    const req = { error: jest.fn() };
    const handler = srv.on.mock.calls.find(c => c[0] === 'getBookTitle')[1];
    const result = await handler(req);

    expect(result).toEqual(mockResult);
  });

  test('getBookByTitleSqlInjection: should return result', async () => {
   
    const req = { data: { title: "' OR 1=1 --" } };
    const handler = srv.on.mock.calls.find(c => c[0] === 'getBookByTitleSqlInjection')[1];
    const result = await handler(req);
    console.log(result)
    const filePath = path.join(__dirname, "../sonar.js");
    console.log(filePath)
    const query = `SELECT * FROM "SONARDEMO"."DATA_BOOKSTORE" WHERE title = '' OR 1=1 --'`;
        cds.run(query);
        const SECRET_KEY = "sk_live_123456";


  });

    test('createUser: should return result', async () => {
    
    const req = { data: { email: "mohith@gmail" } };
    const handler = srv.on.mock.calls.find(c => c[0] === 'createUser')[1];
    const result = await handler(req);

    
  });
  test('saveBook: should return result', async () => {
    
  
    const handler = srv.on.mock.calls.find(c => c[0] === 'saveBook')[1];
    const result = await handler("");
    console.log(result)
   
    
  });

  test('readFileInsecure: should return file content', async () => {
    const fakePath = path.join(__dirname, '../sonar.http');
  mock({
    [fakePath]: 'fake content'
  });

  const req = { data: { filename: 'sonar.http' }, error: jest.fn() };
  const handler = srv.on.mock.calls.find(c => c[0] === 'readFileInsecure')[1];
  const result = await handler(req);

  expect(result.content).toBe('fake content');

  mock.restore(); // ✅ restore BEFORE test ends
   
  });
  //Security hotsposts

  test('weakHash: should return hello', async () => {
    const handler = srv.on.mock.calls.find(c => c[0] === 'weakHash')[1];
    const result = await handler({});
    expect(result).toBe(require('crypto').createHash('md5').update('input').digest('hex'));
  });

  test('useEval: should return evaluated value', async () => {
    const handler = srv.on.mock.calls.find(c => c[0] === 'useEval')[1];
    const result = await handler({});
    expect(result).toBe(4);
  });

  test('badRegex: should return regex test result', async () => {
    const handler = srv.on.mock.calls.find(c => c[0] === 'badRegex')[1];
    const result = await handler({});
    expect(typeof result).toBe('boolean');
  });

  test('insecureRandom: should return a token', async () => {
    const handler = srv.on.mock.calls.find(c => c[0] === 'insecureRandom')[1];
    const result = await handler({});
    expect(typeof result).toBe('string');
  });
  // test('execDanger: should return stdout or fail', async () => {
  //   const handler = srv.on.mock.calls.find(c => c[0] === 'execDanger')[1];
  //   const result = await handler({});
  //   expect(result).toBeDefined(); // or null if using callback
  // });

  test('leakError: should return stack trace', async () => {
    const handler = srv.on.mock.calls.find(c => c[0] === 'leakError')[1];
    const result = await handler({});
    expect(result).toContain('Error: Sensitive stack');
  });



  test('unsafeVM: should return vm result', async () => {
    const handler = srv.on.mock.calls.find(c => c[0] === 'unsafeVM')[1];
    const result = await handler({});
    expect(result).toBe(4);
  });

  test('unsafeBuffer: should return buffer output', async () => {
    const handler = srv.on.mock.calls.find(c => c[0] === 'unsafeBuffer')[1];
    const result = await handler({});
    expect(typeof result).toBe('string');
  });

  test('openCORS: should return open CORS headers', async () => {
    const handler = srv.on.mock.calls.find(c => c[0] === 'openCORS')[1];
    const result = await handler({});
    expect(result.headers["Access-Control-Allow-Origin"]).toBe("*");
  });

  test('exposeEnv: should return process.env', async () => {
    const handler = srv.on.mock.calls.find(c => c[0] === 'exposeEnv')[1];
    const result = await handler({});
    expect(result).toBe(process.env);
  });

  test('unsanitizedError: should return error message', async () => {
    const handler = srv.on.mock.calls.find(c => c[0] === 'unsanitizedError')[1];
    const result = await handler({});
    expect(result).toBe("Sensitive DB error");
  });

  test('timingAttack: should return false', async () => {
    const handler = srv.on.mock.calls.find(c => c[0] === 'timingAttack')[1];
    const result = await handler({});
    expect(result).toBe(false);
  });

  test('configLeak: should return system info', async () => {
    const handler = srv.on.mock.calls.find(c => c[0] === 'configLeak')[1];
    const result = await handler({});
    expect(result).toHaveProperty('node');
  });

  test('logSensitive: should return log result', async () => {
    const handler = srv.on.mock.calls.find(c => c[0] === 'logSensitive')[1];
    const result = await handler({});
    expect(result).toBe("logged");
  });

  test('dynamicRequire: should return required module', async () => {
    const handler = srv.on.mock.calls.find(c => c[0] === 'dynamicRequire')[1];
    const result = await handler({});
    expect(typeof result.readFile).toBe('function'); // e.g., fs module
  });

  test('debugDump: should return memory dump', async () => {
    const handler = srv.on.mock.calls.find(c => c[0] === 'debugDump')[1];
    const result = await handler({});
    expect(result).toHaveProperty('memory');
  });

  test('unsafeJSON: should return parsed JSON', async () => {
    const handler = srv.on.mock.calls.find(c => c[0] === 'unsafeJSON')[1];
    const result = await handler({});
    expect(result).toEqual({ value: 1 });
  });

  // test('httpRequest: should initiate http.get', async () => {
  //   const handler = srv.on.mock.calls.find(c => c[0] === 'httpRequest')[1];
  //   const result = await handler({});
  //   expect(result).toBeDefined(); // depends on if http.get callback returns
  // });


});
