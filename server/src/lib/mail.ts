import { mailTransporter } from "../config/mailer";
import { ENV } from "./env";

export const sendEmail = async (receiver:string, otp:string) => {
    await mailTransporter.sendMail({
        from: `"Crypto Price Alerts" <${ENV.SMTP_USER}>`,
        to: receiver,
        subject: "Your Password Reset OTP",
        html: `
    <div style="
      font-family: Arial, sans-serif; 
      background: #f4f4f4; 
      padding: 20px; 
      display: flex; 
      justify-content: center;
    ">
      <div style="
        background: #ffffff;
        width: 100%;
        max-width: 500px;
        border-radius: 10px;
        padding: 25px;
        border: 1px solid #e5e7eb;
      ">
        <h2 style="text-align:center; color:#111; margin-bottom: 0;">
          🔐 Password Reset Request
        </h2>
        <p style="text-align:center; color:#666; margin-top:4px;">
          Your One-Time Password (OTP) is below
        </p>

        <div style="
          margin: 30px auto; 
          text-align: center; 
          padding: 15px 20px;
          border-radius: 8px;
          background: #111827; 
          color: #ffffff; 
          font-size: 32px; 
          letter-spacing: 4px;
          font-weight: bold;
          width: fit-content;
        ">
          ${otp}
        </div>

        <p style="color:#444; line-height:1.5; text-align:center;">
          Enter this code in the app to reset your password.<br>
          This OTP is valid only for <strong>10 minutes.</strong>
        </p>

        <hr style="margin: 25px 0; border: none; border-top: 1px solid #e5e7eb;" />

        <p style="font-size:13px; color:#888; text-align:center;">
          If you did not request this, you can safely ignore this email.
        </p>

        <p style="text-align:center; margin-top:20px; color:#999;">
          © ${new Date().getFullYear()} Crypto Price Alerts
        </p>
      </div>
    </div>
    `,
    });

    console.log("Mail sent.");
};

