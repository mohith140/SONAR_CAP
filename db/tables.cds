namespace DATA;
// @restrict: [
//   { grant: 'READ', to: 'authenticated-user' },
//   { grant: 'WRITE', to: 'admin' }  // 🔥 Sensitive hardcoded role
// ]



entity Users {
  key ID       : UUID;
  username     : String(100);
  email        : String(200);
  password     : String(200);  // ❌ Sensitive field
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
@readonly
entity AuditLogs {
  key ID       : UUID;
  action       : String(255);
  performedBy  : String(100);
  timestamp    : Timestamp;
  details      : String(500);   // [CWE-200] Information disclosure risk
}

// ❌ Issue 3: Excessive privileges (admin role exposed to all apps)
entity AdminSettings {
  key ID       : UUID;
  configKey    : String(100);
  configValue  : String(500);
  // [CWE-284] No @restrict annotation → broken access control
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
