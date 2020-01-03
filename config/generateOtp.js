
const generate = (data)=>{
   let otp = '';

  for (var i = 0; i <4; i++) {
    otp += data[Math.floor(Math.random()*10)];
  }
  return otp;
}
module.exports.generate = generate;
