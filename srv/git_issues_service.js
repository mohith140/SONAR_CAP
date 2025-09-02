const cds = require('@sap/cds');
const fs = require('fs');
const path = require('path');
const https= require('https');
const { ConnectivitySocks } = require('sap-cf-socks');
const SMTPConnection = require("nodemailer/lib/smtp-connection");
const app = require("express")()
const pg = require("pg")
const pool = new pg.Pool(config);
module.exports =async function (srv) {
 const nodemailer = require("nodemailer");
 
  srv.on("updateEntry",async (req)=> { 
   var query1 =
    "SELECT ITEM,PRICE FROM PRODUCT WHERE ITEM_CATEGORY='" +
    req.params.category +
    "' ORDER BY PRICE";
 })
   srv.on("updateEntry1",async (req)=> {
     var query1 =
    "SELECT ITEM,PRICE FROM PRODUCT WHERE ITEM_CATEGORY='" +
    req.params.category +
    "' ORDER BY PRICE";
  pool.query(query1, [], function(err, results) {
    // process results
  });
 })
}; 