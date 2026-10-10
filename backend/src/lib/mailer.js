import nodemailer from "nodemailer";

// The transporter is created when the first mail is sent (not when this file is imported),
// because ES module imports run BEFORE dotenv loads the .env file in index.js.
const getTransporter = () =>
   nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
   });

export const sendOtpEmail = async (to, otp) => {
   await getTransporter().sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to,
      subject: "Your NexTalk verification code",
      text: `Your NexTalk verification code is ${otp}. It expires in 10 minutes. If you did not request it, ignore this email.`,
      html: `<div style="font-family:Arial,sans-serif"><h2>NexTalk</h2><p>Your verification code is</p><p style="font-size:30px;letter-spacing:6px;font-weight:bold">${otp}</p><p>It expires in 10 minutes. If you did not request it, ignore this email.</p></div>`,
   });
};
