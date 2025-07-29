using DATA from '../db/tables'; // Adjust path as needed
using DATA1 from '../db/orders';

service MainService {
  entity Orders               as projection on DATA1.Orders;
 
  entity Employees as projection on DATA1.Employees;
  entity CreditCards as projection on DATA1.CreditCards;
  entity Secrets as projection on DATA1.Secrets;

  @readonly
  entity Logs as projection on DATA1.Logs;

  entity Feedback as projection on DATA1.Feedback;

  action exposeToken() returns String;
}

service CatalogService {
  entity Books as projection on DATA.Bookstore;
  function getBookTitle() returns String;
  function getBookTitle1() returns String;
  function readFileInsecure() returns String;
  function getBookByTitleSqlInjection() returns String;//{ "title": "' OR 1=1 --" }
  function weakHash() returns String;
}

