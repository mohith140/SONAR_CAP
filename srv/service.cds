using DATA from '../db/tables'; // Adjust path as needed

service CatalogService {
  entity Books as projection on DATA.Bookstore;
}
