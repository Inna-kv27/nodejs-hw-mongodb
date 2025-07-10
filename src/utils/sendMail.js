import nodemailer from 'nodemailer';
import { getEnvVar } from './getEnvVar.js';

const sendMail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: getEnvVar('SMTP_HOST'),
    port: Number(getEnvVar('SMTP_PORT')),
    secure: Number(getEnvVar('SMTP_PORT')) === 465,
    auth: {
      user: getEnvVar('SMTP_USER'),
      pass: getEnvVar('SMTP_PASSWORD'),
    },
  });

  const mailOptions = {
    from: getEnvVar('SMTP_FROM'),
    to: options.to,
    subject: options.subject,
    html: options.html,
  };

  await transporter.sendMail(mailOptions);
};

export default sendMail;
