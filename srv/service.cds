using DATA from '../db/tables'; // Adjust path as needed

service CatalogService {
  entity Books as projection on DATA.Bookstore;
  function getBookTitle() returns String;
  function getBookTitle1() returns String;
  function readFileInsecure() returns String;
  function getBookByTitleSqlInjection() returns String;//{ "title": "' OR 1=1 --" }

}
