namespace DATA;

entity Bookstore1 {
  key ID          : UUID;
      Title       : String(120);
      Author      : String(80);
      Genre       : String(40);
      PublishedOn : Date;
      Price       : Decimal(10,2);
      InStock     : Boolean;
}
