import { mailTransporter } from "../config/mailer";
import { ENV } from "./env";

interface AlertMailData {
  email: string;
  coinId: string;
  symbol: string;
  targetPrice: number;
  currentPrice: number;
  triggeredAt: Date;
}

export const sendAlertEmail = async ({
  email,
  coinId,
  symbol,
  targetPrice,
  currentPrice,
  triggeredAt,
}: AlertMailData) => {
  try {
    await mailTransporter.sendMail({
      from: `"Crypto Price Alerts" <${ENV.SMTP_USER}>`,
      to: email,
      subject: `🚨 ${symbol.toUpperCase()} Price Alert Triggered!`,
      html: `
    <div style="font-family: Arial, sans-serif; background-color: #f9fafb; padding: 24px;">
      <div style="
        background: #ffffff;
        max-width: 520px;
        margin: 0 auto;
        border-radius: 10px;
        padding: 30px 25px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.05);
      ">
        <h2 style="text-align:center; color:#111; margin-bottom: 10px;">
          🚨 Price Alert Triggered!
        </h2>
        <p style="text-align:center; color:#6b7280; margin-top: 0;">
          One of your crypto alerts has just hit the target 🎯
        </p>

        <table style="width:100%; border-collapse:collapse; margin:20px 0;">
          <tr>
            <td style="padding:8px 0; color:#555;">Coin:</td>
            <td style="padding:8px 0; font-weight:bold; text-transform:capitalize;">${coinId}</td>
          </tr>
          <tr>
            <td style="padding:8px 0; color:#555;">Symbol:</td>
            <td style="padding:8px 0; font-weight:bold;">${symbol.toUpperCase()}</td>
          </tr>
          <tr>
            <td style="padding:8px 0; color:#555;">Target Price:</td>
            <td style="padding:8px 0; font-weight:bold; color:#059669;">$${targetPrice}</td>
          </tr>
          <tr>
            <td style="padding:8px 0; color:#555;">Current Price:</td>
            <td style="padding:8px 0; font-weight:bold; color:#dc2626;">$${currentPrice}</td>
          </tr>
          <tr>
            <td style="padding:8px 0; color:#555;">Triggered At:</td>
            <td style="padding:8px 0; font-weight:bold;">${new Date(triggeredAt).toLocaleString()}</td>
          </tr>
        </table>

        <div style="
          background: #111827;
          color: #fff;
          text-align:center;
          padding: 12px 16px;
          border-radius: 8px;
          margin: 25px 0;
          font-size: 15px;
        ">
          💰 ${symbol.toUpperCase()} has reached your target price of $${targetPrice}!
        </div>

        <p style="font-size:13px; color:#6b7280; text-align:center;">
          You can mute or delete this alert anytime from your dashboard.
        </p>

        <hr style="margin:25px 0; border:none; border-top:1px solid #e5e7eb;"/>

        <p style="font-size:12px; color:#9ca3af; text-align:center;">
          © ${new Date().getFullYear()} Crypto Price Alerts
        </p>
      </div>
    </div>
    `
    });
    
    console.log(`📩 Alert email sent to ${email} for ${symbol}`);
  } catch (err: any) {
    console.error("Error sending alert email:", err.message);
  }
};
