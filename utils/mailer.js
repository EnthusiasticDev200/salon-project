require("dotenv").config();
const nodemailer = require("nodemailer");
const FormData = require('form-data')
const Mailgun = require('mailgun.js')


const mailgun = new Mailgun(FormData)

const mg = mailgun.client({
  username : "api",
  key : process.env.MAILGUN_API_KEY
})

const sendOtpEmail = async (toEmail, otp) => {
  try{
    const msg = await mg.messages.create(process.env.MAILGUN_DOMAIN,{
    from: `"KhleanCutz" <postmaster@${process.env.MAILGUN_DOMAIN}>`,
    to: [toEmail],
    subject: "Your OTP for Password Reset",
    html: `<h3>Hello from KhleanCutz!</h3><p>Your OTP is: <strong>${otp}</strong>. 
        It expires in 5 minutes.</p>`
  })
    console.log("Email sent:",msg.id)
  }catch(err){
    console.log("Error sending email", err.stack)
    throw err
  }
  
};

module.exports = { sendOtpEmail };
