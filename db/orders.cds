namespace DATA1;
entity Orders {
  key ID     : UUID;
      total  : Decimal(10,2);
      status : String;
}

@restrict: [
  { grant: 'READ', to: 'authenticated-user' },
  { grant: 'WRITE', to: 'admin' }
]
entity Payments {
  key ID     : UUID;
      amount : Decimal(10,2);
      method : String;
}

entity Employees {
  key ID     : UUID;
      name   : String;
      ssn    : String;
}

entity Users {
  key ID     : UUID;
      email  : String(1000);
}

entity CreditCards {
  key ID        : UUID;
      cardNumber: String;
      cvv       : String;
}

@readonly
entity Logs {
  key ID      : UUID;
      message : String;
      level   : String;
}

entity Secrets {
  key ID    : UUID;
      token : String;
}

entity PublicSecrets as projection on Secrets;

entity Sessions {
  key ID   : UUID;
      token: String;
}

entity OrdersWithCustomers {
  key ID       : UUID;
      customer : Association to Customers;
}

entity Customers {
  key ID   : UUID;
      name : String;
}

entity Feedback {
  key ID     : UUID;
      comment: String(5000);
}


Entity ![ZCORTO0030812_DATA_data_App] {
key 	![Id]: Integer  @title: 'Id' ; 
		![Title]: String(250)  @title: 'Title' ; 
		![CreatedOn]: Timestamp  @cds.on.insert: $now @title: 'CreatedOn' ; 
		![CreatedBy]: String(10) @cds.on.insert: $user @title: 'CreatedBy' ; 
		![DomainId]: Integer  @title: 'DomainId' ; 
}
