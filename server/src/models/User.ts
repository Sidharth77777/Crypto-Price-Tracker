import mongoose, { HydratedDocument, InferSchemaType, Schema } from "mongoose";

const UserSchema = new Schema({
    email: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    phone: { type: String },
    notifyEmail: { type: Boolean, default: true },
    notifySMS: { type: Boolean, default: false },
    notifyCall: { type: Boolean, default: false },

    resetOtpHash: { type: String },
    resetOtpExpires: { type: Date },
}, { timestamps: true });

export type User = InferSchemaType<typeof UserSchema>;
export type UserDoc = HydratedDocument<User>;

const UserModel = mongoose.model<User>("User", UserSchema);
export default UserModel;
