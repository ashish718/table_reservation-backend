const express = require('express');
const app = express();
const mysql = require('mysql');
const bodyparser = require('body-parser');
let db = require('./db');
const reservationRoute = require('./routes/reservation');

app.use(bodyparser.json());

app.use(bodyparser.urlencoded({extended: true}));


// app.use(express.json());

app.use("/api", reservationRoute);


app.listen(5000, ()=>{
  console.log("server is listening on 5000..");
})
