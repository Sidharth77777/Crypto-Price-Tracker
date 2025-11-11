import bcrypt from "bcrypt";
import crypto from "crypto";
import { ENV } from "./env";

export const generateOtp = () => {
    return crypto.randomInt(100000, 999999).toString();
}

export const setUserOtp = async(user:any, otp:string): Promise<void> => {
    user.resetOtpHash = await bcrypt.hash(otp, Number(ENV.SALT_ROUNDS) || 10);
    user.resetOtpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();
}

export const verifyBothOtps = async(user:any, otp:string): Promise<boolean> => {
    if (!user.resetOtpExpires || !user.resetOtpHash) return false;
    if (user.resetOtpExpires < new Date()) return false;
    return bcrypt.compare(otp, user.resetOtpHash);
}