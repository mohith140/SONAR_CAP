namespace DATA;

entity Bookstore {
  key ID          : UUID;
      Title       : String(120);
      Author      : String(80);
      Genre       : String(40);
      Price       : Decimal(10,2);
      InStock     : Boolean;
      Date1        : DateTime;
}
