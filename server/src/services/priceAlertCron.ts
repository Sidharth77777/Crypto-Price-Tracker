import cron from "node-cron";
import axios from "axios";
import CoinAlertModel from "../models/CoinAlert";
import { sendAlertEmail } from "../lib/AlertMail";

const checkAlerts = async () => {
  try {
    console.log("Running alert checker...");

    const activeAlerts = await CoinAlertModel.find({ isActive: true })
      .populate("userId", "email");

    if (!activeAlerts.length) {
      console.log("No active alerts to process...");
      return;
    }

    const groupedByCoin: Record<string, typeof activeAlerts> = {};

    for (const alert of activeAlerts) {
    const coinId = alert.coinId?.toString();
    if (!coinId) {
        console.warn("Skipping alert with missing coinId:", alert._id);
        continue;
    }

    if (!groupedByCoin[coinId]) groupedByCoin[coinId] = [];
    groupedByCoin[coinId].push(alert);
    }

    for (const [coinId, alerts] of Object.entries(groupedByCoin)) {
      try {
        const url = `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`;
        const { data } = await axios.get(url);

        const currentPrice: number | null = data[coinId]?.usd;
        if (!currentPrice) continue;

        for (const alert of alerts) {
          const email = (alert.userId as any)?.email;
          if (!email) {
            console.warn(`No email found for user ${alert.userId}`);
            continue;
          }

          if (alert.muteEmailNotifications) {
            console.log(`Skipping ${coinId} for ${email} (muted)`);
            continue;
          }

          if (currentPrice >= alert.targetPrice && alert.isActive) {
            console.log(`Triggered alert for ${coinId} — Target: ${alert.targetPrice}, Current: ${currentPrice}`);

            alert.isActive = false;
            alert.triggeredAt = new Date();
            await alert.save();

            await sendAlertEmail({
              email,
              coinId: alert.coinId,
              symbol: alert.symbol,
              targetPrice: alert.targetPrice,
              currentPrice,
              triggeredAt: alert.triggeredAt,
            });
          }
        }
      } catch (err: any) {
        console.error(`Error processing ${coinId}:`, err.message);
      }
    }
  } catch (err: any) {
    console.error("Error in checkAlerts cron:", err.message);
  }
};

cron.schedule("*/1 * * * *", checkAlerts);
