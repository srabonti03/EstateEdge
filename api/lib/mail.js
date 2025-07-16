import nodemailer from "nodemailer";

// Create a transporter object using SMTP transport
export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

//For testing purposes only
// export const transporter = nodemailer.createTransport({
//   host: "hostname",
//   port: portnumber,
//   auth: {
//     user: "username",
//     pass: "password",
//   },
//   secure: false,
//   tls: {
//     rejectUnauthorized: false,
//   },
// });
