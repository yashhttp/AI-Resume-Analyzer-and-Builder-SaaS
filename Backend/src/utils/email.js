import dotenv from "dotenv"
dotenv.config()

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})
console.log("EMAIL_USER:", process.env.EMAIL_USER)
console.log("EMAIL_PASS:", process.env.EMAIL_PASS)

export const sendEmail = async (to, subject, text)=>{
    await transporter.sendMail(
        {
            from:`"AI Resume Analyzer" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text
        }
    )
}