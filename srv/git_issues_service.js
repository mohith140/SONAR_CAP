const cds = require('@sap/cds');
const app = require("express")()
module.exports =async function (srv) {
 const nodemailer = require("nodemailer");
 
  srv.on("updateEntry",async (req)=> { 
   var query1 =
    "SELECT ITEM,PRICE FROM PRODUCT WHERE ITEM_CATEGORY='" +
    req.params.category +
    "' ORDER BY PRICE";
    const result = await cds.run(query1);
    console.log(result);
 })


}; 