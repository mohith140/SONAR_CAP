using DATA from '../db/tables'; // Adjust path as needed
using DATA1 from '../db/orders';
service Service2 @(path: 'service-2') {
  /* Read access only to users with access level greater than 2. */
  @(restrict: [ { grant: 'READ', to: '$user.level > 2' } ])
  entity Service2Entity {
    Attribute1 : String(100);
    Attribute2 : String(100)
  }
}
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

