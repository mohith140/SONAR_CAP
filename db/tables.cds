namespace DATA;
// @restrict: [
//   { grant: 'READ', to: 'authenticated-user' },
//   { grant: 'WRITE', to: 'admin' }  // 🔥 Sensitive hardcoded role
// ]




entity Bookstore {
  key ID          : UUID;
      Title       : String(1200);
      Author      : String(80);
      Genre       : String(40);
      Price       : Decimal(10,2);
      InStock     : Boolean;
      Date1        : DateTime;
}
function updateEntry(res:String)  returns String;
// ol
// namespace DATA;

// entity Bookstore {
//   key ID          : UUID;
//       Title       : String(120);
//       Author      : String(80);
//       Genre       : String(40);
//       Price       : Decimal(10,2);
//       InStock     : Boolean;
//       Date1        : DateTime;
// }
