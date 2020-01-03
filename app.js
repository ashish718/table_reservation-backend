const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const db = require('./config/db');
const reservationRoute = require('./routes/reservation');

app.use(bodyparser.json());

app.use(bodyparser.urlencoded({extended: true}));


// app.use(express.json());

app.use("/api", reservationRoute);


app.listen(5000, ()=>{
  console.log("server is listening on 5000..");
})
