import axios from "axios";
import type { Response } from "express";
import CoinModel from "../models/CoinModel";
import CoinAlertModel from "../models/CoinAlert";
import { AuthedRequest } from "../middleware/checkLogin";
import mongoose from "mongoose";

type DetailPlatform = {
    contract_address?: string;
    decimal_place?: number;
};

export const getAllAlerts = async (req: AuthedRequest, res: Response) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(400).json({ success: false, message: "Unauthorized" });
        }

        const getAllAlerts = await CoinAlertModel.find({userId});

        if (!getAllAlerts) {
            return res.status(200).json({success:true, message:"No Coin Alerts Found"})
        }

        return res.status(200).json({success:true, length:getAllAlerts.length, message: "Fetched Alerts", data:getAllAlerts});

    } catch (err: any) {
        console.error("Error getting user alert:", err.response?.data || err.message);
        return res
            .status(500)
            .json({ success: false, message: "Internal Server Error", error:err.response?.data || err.message });
        }
}

export const createAlert = async (req: AuthedRequest, res: Response) => {
    try {
        const userId: string | undefined = req.user?.userId;

        const { coinId, symbol, targetPrice } = req.body as {
            coinId?: string;
            symbol?: string;
            targetPrice: number;
        };

        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        if (!coinId && !symbol) {
            return res
                .status(400)
                .json({ success: false, message: "Provide coinId or symbol" });
        }

        if (!targetPrice) {
            return res
                .status(400)
                .json({ success: false, message: "Provide targetPrice" });
        }

        let coin: any;
        let finalCoinId = coinId;
        if (!finalCoinId && symbol) {
            coin = await CoinModel.findOne({ symbol: symbol.toLowerCase() });
            if (!coin) {
                return res
                    .status(404)
                    .json({ success: false, message: "Coin not found in DB" });
            }
            finalCoinId = coin.id;
        }

        const url: string = `https://api.coingecko.com/api/v3/coins/${finalCoinId}`;
        const { data } = await axios.get(url);

        const dbCA = Object.values(coin?.platforms || {})[0] || "";
        const platforms = Object.values(data.detail_platforms || {}) as DetailPlatform[];
        const apiCA: string = platforms[0]?.contract_address || "";
        const contractAddress = dbCA || apiCA;

        const alertData = {
            userId,
            coinId: finalCoinId!,
            symbol: data.symbol?.toUpperCase() || symbol?.toUpperCase(),
            contractAddress,
            targetPrice,
            image: data.image?.thumb || "",
        };

        const newAlert = await CoinAlertModel.create(alertData);

        return res.status(201).json({
            success: true,
            message: "Alert created successfully",
            alert: newAlert,
        });
    } catch (err: any) {
        console.error("Error creating alert:", err.response?.data || err.message);
        return res
            .status(500)
            .json({ success: false, message: "Internal Server Error", error:err.response?.data || err.message });
    }
};

export const updateAlert = async(req:AuthedRequest, res:Response) => {
    try {
        const userId = req.user?.userId;
        const { alertId } = req.params;
        const { targetPrice } = req.body;

        if (!userId) {
            return res.status(400).json({ success: false, message: "Unauthorized" });
        }
        if (!alertId) {
            return res.status(400).json({ success: false, message: "Missing alertId" });
        }
        if (targetPrice === undefined || targetPrice === null) {
            return res.status(400).json({ success: false, message: "Missing updated Target Price" });
        }
        if (typeof targetPrice !== "number" || isNaN(targetPrice)) {
            return res.status(400).json({success: false, message: "Target Price must be a valid number",});
        }

        if (!mongoose.Types.ObjectId.isValid(alertId)) {
            return res.status(404).json({
                success: false,
                message: "Alert not found (invalid ID format)",
            });
        }

        const alert = await CoinAlertModel.findOneAndUpdate(
            { _id: alertId, userId},
            { targetPrice },
            {new: true}
        );

        if (!alert) {
            return res.status(404).json({ success: false, message: "Alert not found or you don't have permission to delete it" });
        }

        return res.status(200).json({ success: true, message: "Updated Alert Successfully", updatedAlert: alert });

    } catch(err:any) {
        console.error("Error updating alert:", err.message);
        return res.status(500).json({ success: false, message: "Internal Server Error", error:err.response?.data || err.message })
    }
}

export const deleteAlert = async (req: AuthedRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        const { alertId } = req.params;

        if (!userId) {
            return res.status(400).json({ success: false, message: "Unauthorized" });
        }
        if (!alertId) {
            return res.status(400).json({ success: false, message: "Missing alertId" });
        }

        if (!mongoose.Types.ObjectId.isValid(alertId)) {
            return res.status(404).json({
                success: false,
                message: "Alert not found (invalid ID format)",
            });
        }

        const alert = await CoinAlertModel.findOneAndDelete({ _id: alertId, userId });

        if (!alert) {
            return res.status(404).json({ success: false, message: "Alert not found or you don't have permission to delete it" });
        }

        return res.status(200).json({ success: true, message: "Deleted Alert Successfully", deletedAlert: alert });

    } catch (err: any) {
        console.error("Error deleting alert:", err.message);
        return res.status(500).json({ success: false, message: "Internal Server Error", error:err.response?.data || err.message });
    }
}

export const muteAlert = async(req:AuthedRequest, res:Response) => {
    try {
        const userId = req.user?.userId;
        const { alertId } = req.params;

        if (!userId) {
            return res.status(400).json({ success: false, message: "Unauthorized" });
        }
        if (!alertId) {
            return res.status(400).json({ success: false, message: "Missing alertId" });
        }
        if (!mongoose.Types.ObjectId.isValid(alertId)) {
            return res.status(404).json({
                success: false,
                message: "Alert not found (invalid ID format)",
            });
        }
        
        const alert = await CoinAlertModel.findOneAndUpdate(
            { _id: alertId, userId},
            { muteEmailNotifications: true },
            {new: true}
        );

        if (!alert) {
            return res.status(404).json({ success: false, message: "Alert not found or you don't have permission to mute it" });
        }

        return res.status(200).json({ success: true, message: "Muted Alert Successfully", updatedAlert: alert });

    }catch (err: any) {
        console.error("Error muting notifiations:", err.message);
        return res.status(500).json({ success: false, message: "Internal Server Error", error:err.response?.data || err.message });
    }
}

export const unMuteAlert = async(req:AuthedRequest, res:Response) => {
    try {
        const userId = req.user?.userId;
        const { alertId } = req.params;

        if (!userId) {
            return res.status(400).json({ success: false, message: "Unauthorized" });
        }
        if (!alertId) {
            return res.status(400).json({ success: false, message: "Missing alertId" });
        }
        if (!mongoose.Types.ObjectId.isValid(alertId)) {
            return res.status(404).json({
                success: false,
                message: "Alert not found (invalid ID format)",
            });
        }
        
        const alert = await CoinAlertModel.findOneAndUpdate(
            { _id: alertId, userId},
            { muteEmailNotifications: false },
            {new: true}
        );

        if (!alert) {
            return res.status(404).json({ success: false, message: "Alert not found or you don't have permission to mute it" });
        }

        return res.status(200).json({ success: true, message: "Unmuted Alert Successfully", updatedAlert: alert });

    }catch (err: any) {
        console.error("Error unmuting notifiations:", err.message);
        return res.status(500).json({ success: false, message: "Internal Server Error", error:err.response?.data || err.message });
    }
}