import { Request, Response } from "express";
import CoinModel from "../models/CoinModel";

export const fetchCoinData = async (req: Request, res: Response) => {
  try {
    const { query } = req.body as { query?: string };

    if (!query || !query.trim()) {
      return res.status(400).json({ success: false, message: "Provide a search query" });
    }

    const search: string = query.trim().toLowerCase();

    const coins = await CoinModel.aggregate([
      {
        $match: {
          $or: [
            { id: { $regex: `^${search}`, $options: "i" } },
            { name: { $regex: `^${search}`, $options: "i" } },
            { symbol: { $regex: `^${search}`, $options: "i" } },
          ],
        },
      },
      {
        $addFields: {
          relevance: {
            $switch: {
              branches: [
                { case: { $eq: [{ $toLower: "$id" }, search] }, then: 3 },
                { case: { $eq: [{ $toLower: "$name" }, search] }, then: 3 },
                { case: { $eq: [{ $toLower: "$symbol" }, search] }, then: 3 },
                { case: { $regexMatch: { input: { $toLower: "$id" }, regex: `^${search}` } }, then: 2 },
                { case: { $regexMatch: { input: { $toLower: "$name" }, regex: `^${search}` } }, then: 2 },
                { case: { $regexMatch: { input: { $toLower: "$symbol" }, regex: `^${search}` } }, then: 2 },
              ],
              default: 1,
            },
          },
        },
      },
      { $sort: { relevance: -1, name: 1 } },
      { $limit: 10 },
    ]);

    if (!coins || coins.length === 0) {
      return res.status(404).json({ success: false, message: "No coins found" });
    }

    return res.status(200).json({ success: true, length: coins.length, data: coins });
  } catch (err: any) {
    console.error("Failed to fetch Coin Data", err);
    return res.status(500).json({ success: false, message: "Failed to fetch Coin Data" });
  }
};
