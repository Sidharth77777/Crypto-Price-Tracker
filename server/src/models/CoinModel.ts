import mongoose, { Schema, InferSchemaType, HydratedDocument } from "mongoose";

const CoinSchema = new Schema({
  id: { type: String, required: true, unique: true, index: true },
  symbol: { type: String, required: true },
  name: { type: String, required: true },
}, { timestamps: true });

export type Coin = InferSchemaType<typeof CoinSchema>;
export type CoinDoc = HydratedDocument<Coin>;

const CoinModel = mongoose.model<Coin>("Coin", CoinSchema);
export default CoinModel;
