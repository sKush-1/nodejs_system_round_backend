import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_MAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function sendEmail(to, subject, text) {
  const info = await transporter.sendMail({
    from: process.env.SMTP_MAIL,
    to: to,
    subject: subject,
    text: text,
    html: `${text}`,
  });
  console.log("Message sent: %s", info.messageId);
}
