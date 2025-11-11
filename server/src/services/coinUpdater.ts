import axios from "axios";
import cron from "node-cron";
import CoinModel from "./../models/CoinModel";

const fetchAndStoreCoins = async (): Promise<void> => {
  try {
    console.log("Updating coins...");

    const { data } = await axios.get("https://api.coingecko.com/api/v3/coins/list");
    console.log(`🔁 Fetched ${data.length} coins from CoinGecko`);

    const newCoinIds = data.map((coin: any) => coin.id);

    const deleteResult = await CoinModel.deleteMany({ id: { $nin: newCoinIds } });
    console.log(`Deleted ${deleteResult.deletedCount} outdated coins`);

    const bulkOps = data.map((coin: any) => ({
      updateOne: {
        filter: { id: coin.id },
        update: { $set: { symbol: coin.symbol, name: coin.name } },
        upsert: true,
      },
    }));

    await CoinModel.bulkWrite(bulkOps);
    console.log("Coin list updated successfully");

  } catch (err) {
    console.error("Error updating coins:", err);
  }
};


cron.schedule("0 0 * * *", async () => {
  console.log("Running daily CoinGecko sync...");
  await fetchAndStoreCoins();
});

export { fetchAndStoreCoins };
