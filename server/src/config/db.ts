import mongoose from "mongoose";
import { ENV } from "../lib/env";
import AlertModel from "../models/CoinAlert";

export const connectDB = async(): Promise<void> => {
    try{
        const mongoURI = ENV.MONGODB_URI;

        if (!mongoURI) throw new Error("MONGODB_URL is not defined in Environmental variables");

        await mongoose.connect(mongoURI);
        console.log("DB connected successfully");

        await AlertModel.collection.createIndex(
            { userId: 1, coinId: 1, targetPrice: 1, isActive: 1 },
            { unique: true, partialFilterExpression: { isActive: true } }
        );

        process.on('SIGINT', async() => {
            await mongoose.connection.close();
            process.exit(0);
        })
    } catch (err:any) {
        throw new Error(`Failed to connect to mongoDB: ${err}`)
    }
}

export const disconnectDB = async(): Promise<void> => {
    try{
        await mongoose.connection.close();
    } catch(err:any) {
        throw new Error(`Failed to disconnect from mongoDB: ${err}`)
    }
}