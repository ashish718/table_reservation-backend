let db = require('../config/db');
let {generate} = require('../config/generateOtp');

exports.outletFind = (req, res)=>{
  let [cityName, outletName] = [req.params.cityName, req.params.outletName];
  let sql = `SELECT o_address AS Address, timing.dayname AS Day, TIME_FORMAT(timing.start_at, '%h:%i %p') AS Open,
              TIME_FORMAT(timing.end_at, '%h:%i %p') AS Closed
              FROM outlet JOIN timing
              ON outlet.o_id = timing.outlet_id
              where city_name = ? AND o_name=?`;
    return db.query(sql, [cityName, outletName], (err, result)=>{
      if (err) {
        return res.json(err.message)
      }
      //example- Monday 9:00AM to 7:00PM
      for (var i = 0; i < result.length; i++) {
         console.log(result[i].Day, result[i].Open, "-" ,result[i].Closed);
      }
  })
}


exports.genOtp = async (req, res)=>{
  let phone = req.body.phone;

  const g_otp = await generate(phone);

  const storeOtp = await db.query("insert into otp (otp_generate) VALUES (?)", g_otp, (err, result)=>{
    if (err) {
      console.log("store Otp:", err.message)
    }
    console.log("otp stored in db:", result)
  });
}


exports.verifyOtp = (req, res)=>{
  const getOtp = req.body.getOtp;

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
}

exports.reserve = (req, res)=>{
  let fullname = req.body.fullname;
  let email = req.body.email;
  let phone = req.body.phone;
  let numberPerson = req.body.numberPerson;
  let dayTime = req.body.dayTime;
  let outlet = req.body.outlet;
  let uID;

  db.query("INSERT INTO `user` (user_fullname, user_email, user_phone) VALUES (?,?,?)", [fullname, email, phone],  async (err, results)=>{
    if (err) {
      console.log(err.message)
    }
     uID= results.insertId;
    await db.query("insert into reserve_table (r_userId, r_person, r_DateTime, outlet_id) VALUES (?,?,?,?)", [uID, numberPerson, dayTime, outlet], (err, data)=>{
        console.log(data)
      })
   })
}
