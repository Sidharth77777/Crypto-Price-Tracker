import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { ENV } from "../lib/env";

export const mailTransporter = nodemailer.createTransport(
    {
        secure: true,
        service: "gmail",
        host: ENV.SMTP_HOST,
        port: Number(ENV.SMTP_PORT),
        auth: {
            user: ENV.SMTP_USER,
            pass: ENV.SMTP_PASSWORD,
        },
        tls: {
            rejectUnauthorized: false,
        },
        dns: { family: 4 },
    } as SMTPTransport.Options
);
