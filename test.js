const nodemailer = require("nodemailer")

function sendmail( email)
{
   const random = Math.floor(Math.random() * 99999) + 10000;
  
//   console.log(random);
 var transporter = nodemailer.createTransport({
   service: 'gmail',
   auth: {
     user: "annanay2112029@akgec.ac.in",
     pass: "insaobwfvogscokh" ,
   }
 })
 var mailOptions = {
  from: 'aggarwalannanay@gmail.com',
  to: `${email}`,
  subject: 'registor email verification',
  text: `OTP IS ${random}`
}
transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
})

return random;
}

const otp = sendmail("anni.agg2003@gmail.com")