let router = require('express').Router();
const db = require('../db.js');
const {generate} = require('../otp.js');

router.get('/', (req, res)=>{
  db.query("select * from timing", (err, result)=>{
    if (err) {
      res.status(400).send(err.message)
    }
    res.status(200).send(result);
  })
})

router.get('/outlet/:cityName/:outletName', (req, res)=>{
  let cityName = req.params.cityName;
  let outletName = req.params.outletName;
  console.log(cityName, outletName);
  let sql = `SELECT o_address AS Address, timing.dayname AS Day, TIME_FORMAT(timing.start_at, '%h:%i %p') AS Open, TIME_FORMAT(timing.end_at, '%h:%i %p') AS Closed
              FROM outlet JOIN timing
              ON outlet.o_id = timing.outlet_id
              where city_name = ? AND o_name=?`;
    db.query(sql, [cityName, outletName], (err, result)=>{
      if (err) {
        console.log(err.message)
      }

      for (var i = 0; i < result.length; i++) {
        console.log(result[i].Day, result[i].Open, "-" ,result[i].Closed);
      }

  })
})


router.post('/otp', async (req, res)=>{
  let phone = req.body.phone;

  const g_otp = await generate(phone);

  const storeOtp = await db.query("insert into otp (otp_generate) VALUES (?)", g_otp, (err, result)=>{
    if (err) {
      console.log("store Otp:", err.message)
    }
    console.log("otp stored in db:", result)
  });
})

router.post('/verifyOtp', (req, res)=>{
  const getOtp = req.body.getOtp;
  console.log(getOtp);
  if(getOtp.length>4) return res.status(400).send("invalid OTP");

  db.query("select ABS(UNIX_TIMESTAMP(otp_created)-UNIX_TIMESTAMP()) as output from otp where otp_generate=?", getOtp, async (err, result)=>{
    if(err) console.log("verifyOtp error", err.message);

    else if(result.length==0) {
       return console.log("invalid Otp");
    }
    //second difference
    const sec = await result[0].output
    //check 30 Minutes
    if (sec<=1800) {
      res.status(200).send("otp Matched Succesfully")
    }
    else{
      res.status(400).send("timeout generate new otp");
    }

  })

})

router.post('/reserve',  (req, res)=>{
  let fullname = req.body.fullname;
  let email = req.body.email;
  let phone = req.body.phone;
  let numberPerson = req.body.numberPerson;
  let dayTime = req.body.dayTime;
  let outlet = req.body.outlet;
  let uID;
  console.log(fullname, phone, email);

  db.query("INSERT INTO `user` (user_fullname, user_email, user_phone) VALUES (?,?,?)", [fullname, email, phone],  async (err, results)=>{
    if (err) {
      console.log(err.message)
    }
     uID= results.insertId;
    await db.query("insert into reserve_table (r_userId, r_person, r_DateTime, outlet_id) VALUES (?,?,?,?)", [uID, numberPerson, dayTime, outlet], (err, data)=>{
        console.log(data)
      })
   })
})


module.exports = router;
