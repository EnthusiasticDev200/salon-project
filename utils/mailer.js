const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOtpEmail = async (toEmail, otp) => {
  const mailOptions = {
    from: `"KhleanCutz" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Your OTP for Password Reset",
    html: `<h3>Hello from KhleanCutz!</h3><p>Your OTP is: <strong>${otp}</strong>. 
        It expires in 2 minutes.</p>`,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendOtpEmail };
