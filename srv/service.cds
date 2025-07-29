using DATA from '../db/tables'; // Adjust path as needed
using DATA1 from '../db/orders';

service MainService {
  entity Orders               as projection on DATA1.Orders;
  entity Payments             as projection on DATA1.Payments;
  entity Employees            as projection on DATA1.Employees;
  entity Users                as projection on DATA1.Users;
  entity CreditCards          as projection on DATA1.CreditCards;
  entity Logs                 as projection on DATA1.Logs;
  entity Secrets              as projection on DATA1.Secrets;
  entity PublicSecrets        as projection on DATA1.PublicSecrets;
  entity Sessions             as projection on DATA1.Sessions;
  entity OrdersWithCustomers  as projection on DATA1.OrdersWithCustomers;
  entity Customers            as projection on DATA1.Customers;
  entity Feedback             as projection on DATA1.Feedback;
}

service CatalogService {
  entity Books as projection on DATA.Bookstore;
  function getBookTitle() returns String;
  function getBookTitle1() returns String;
  function readFileInsecure() returns String;
  function getBookByTitleSqlInjection() returns String;//{ "title": "' OR 1=1 --" }
  function weakHash() returns String;
}

