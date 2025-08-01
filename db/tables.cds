namespace DATA;
// @restrict: [
//   { grant: 'READ', to: 'authenticated-user' },
//   { grant: 'WRITE', to: 'admin' }  // 🔥 Sensitive hardcoded role
// ]

Entity ![ZCORTO0030812_DATA_data_App] {
key 	![Id]: Integer  @title: 'Id' ; 
		![Title]: String(250)  @title: 'Title' ; 
		![CreatedOn]: Timestamp  @cds.on.insert: $now @title: 'CreatedOn' ; 
		![CreatedBy]: String(10) @cds.on.insert: $user @title: 'CreatedBy' ; 
		![DomainId]: Integer  @title: 'DomainId' ; 
}


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
