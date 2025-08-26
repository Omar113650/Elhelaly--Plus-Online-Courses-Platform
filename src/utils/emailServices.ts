import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.APP_EMAIL_ADDRESS,
    pass: process.env.APP_EMAIL_PASSWORD,
  },
});

interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export const sendEmail = async ({ to, subject, text, html }: EmailOptions) => {
  try {
    await transporter.sendMail({
      from: `"Edraak Plus" <${process.env.APP_EMAIL_ADDRESS}>`,
      to,
      subject,
      text,
      html,
    });
  } catch (error: any) {
    console.error(" Error sending email:", error.message, error.response || "");
    throw error; 
  }
};
