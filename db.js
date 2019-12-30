var mysql = require('mysql');

let db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'ashish',
  database: 'table_reservation'
});


db.connect((err)=>{
  if (err) {
    console.log("DB Error:" , err);
  }
  console.log("Database is connected..")
})


module.exports = db;
