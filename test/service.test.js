const cds = require('@sap/cds');
const path = require('path');
const fs = require('fs');
const mock = require('mock-fs');

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

    cds.entities = jest.fn().mockReturnValue({ Bookstore: 'DATA_BOOKSTORE' });
    cds.ql = { SELECT: { from: () => ({ limit: () => mockBooks }) } };
    cds.run = jest.fn().mockResolvedValue(mockBooks);

    const req = { query: {}, error: jest.fn() };
    const handler = srv.on.mock.calls.find(c => c[0] === 'getBookTitle1')[1];
    const result = await handler(req);

    expect(result).toEqual(mockBooks);
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
    const mockResult = [{ ID: 2, TITLE: 'Injected Book' }];
    cds.run = jest.fn().mockResolvedValue(mockResult);

    const req = { data: { title: "Injected" } };
    const handler = srv.on.mock.calls.find(c => c[0] === 'getBookByTitleSqlInjection')[1];
    const result = await handler(req);

    expect(result).toEqual(mockResult);
    expect(cds.run).toHaveBeenCalledWith(expect.stringContaining("Injected"));
  });

  test('readFileInsecure: should return file content', async () => {
    // Simulate file system
    mock({
      [path.join(__dirname, '../sonar.http')]: 'fake content'
    });

    const req = { error: jest.fn() };
    const handler = srv.on.mock.calls.find(c => c[0] === 'readFileInsecure')[1];
    const result = await handler(req);

    expect(result.content).toBe('fake content');
    mock.restore();
  });
});
