import mongoose, { HydratedDocument, InferSchemaType, Schema } from "mongoose";

const CoinAlertSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    coinId: { type: String, required: true, trim: true },
    symbol: { type: String, required: true, uppercase: true },
    contractAddress: { type: String },
    targetPrice: { type: Number, required: true },
    triggeredAt: { type: Date, default: null },
    isActive: { type: Boolean, default: true },
    muteEmailNotifications: {type:Boolean, default:false},
    image: { type: String },

}, { timestamps: true });

export type Alert = InferSchemaType<typeof CoinAlertSchema>;
export type AlertDoc = HydratedDocument<Alert>;

const CoinAlertModel = mongoose.model<Alert>("Alert", CoinAlertSchema);
export default CoinAlertModel;