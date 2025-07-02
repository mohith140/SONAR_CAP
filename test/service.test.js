const cds = require('@sap/cds');
const path = require('path');
const fs = require('fs');

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
});
