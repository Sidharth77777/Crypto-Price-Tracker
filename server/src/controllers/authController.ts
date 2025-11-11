import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserModel, { UserDoc } from "../models/User";
import { ENV } from "../lib/env";
import { generateOtp, setUserOtp, verifyBothOtps } from "../lib/otp";
import { sendEmail } from "../lib/mail";

export const registerUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body as { email: string; password: string };

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required." });
        }

        const normalizedEmail = email.trim().toLowerCase();

        if (password.length < 6) {
            return res.status(400).json({ success: false, message: "Password must be at least 6 characters." });
        }

        const existing = await UserModel.findOne({ email: normalizedEmail });
        if (existing) {
            return res.status(400).json({ success: false, message: "Email already registered." });
        }

        const saltRounds = Number(ENV.SALT_ROUNDS ?? 10);
        const passwordHash = await bcrypt.hash(password, saltRounds);

        const user: UserDoc = await UserModel.create({
            email: normalizedEmail,
            passwordHash
        });

        const token = jwt.sign(
            { userId: String(user._id) },
            ENV.JWT_SECRET as string,
            { expiresIn: "10d" }
        );

        return res.status(201).json({
            success: true,
            token,
            user: {
                id: String(user._id),
                email: user.email,
            }
        });

    } catch (err: any) {
        console.error("Registration error:", err);
        return res.status(500).json({ success: false, message: "Registration failed." });
    }
};

export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body as { email: string; password: string };

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const user: UserDoc | null = await UserModel.findOne({ email: normalizedEmail });
        if (!user) {
            return res.status(401).json({ success: false, message: "No User Found" })
        }

        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) {
            return res.status(401).json({ success: false, message: "Invalid Credentials" })
        }

        const token = jwt.sign(
            { userId: String(user._id), email: user.email },
            ENV.JWT_SECRET as string,
            { expiresIn: "10d" }
        );

        return res.status(200).json({
            success: true,
            token,
            user: {
                id: String(user._id),
                email: user.email,
            }
        })

    } catch (err: any) {
        console.error("Login error", err);
        return res.status(500).json({ success: false, message: "Login Failed" });
    }
}

export const forgotPassword = async(req:Request, res:Response) => {
    try {
        const {email} = req.body as {email:string};

        if (!email) {
            return res.status(400).json({success:false, message:"Email is required"});
        }
        const normalizedEmail = email.trim().toLowerCase();

        const user: UserDoc | null = await UserModel.findOne({email: normalizedEmail});

        if (!user) {
            return res.status(200).json({success:true, message:"OTP sent to your Gmail for changing password"});
        }

        const otp = generateOtp();
        await setUserOtp(user, otp);

        await sendEmail(normalizedEmail, otp);

        return res.status(200).json({success:true, message:"OTP sent to your Gmail for changing password"})

    } catch(err:any) {
        console.error("Failed to forgot password", err);
        return res.status(500).json({success:false, message:"Failed to forgot password"});
    }
}

export const verifyOTP = async(req:Request, res:Response) => {
    try{
        const {email, otp} = req.body as {email:string; otp:string};

        if (!email || !otp) {
            return res.status(400).json({success:false, message:"Email and OTP are required"});
        }
        const normalizedEmail = email.trim().toLowerCase();

        const user: UserDoc | null = await UserModel.findOne({email: normalizedEmail});
        if (!user) {
            return res.status(400).json({success:false, message:"Invalid OTP"});
        }

        const ok: boolean = await verifyBothOtps(user, otp);
        if (!ok) {
            return res.status(400).json({success:false, message:"Invalid or Expired OTP"}); 
        }

        return res.status(200).json({success:true, message:"OTP verified successfully"});

    } catch(err:any) {
        console.error("Failed to verify OTP", err);
        return res.status(500).json({success:false, message:"Failed to verify OTP"})
    }
} 

export const resetPassword = async(req:Request, res:Response) => {
    try{
        const {email, otp, newPassword} = req.body as {email:string; otp:string; newPassword:string};

        if (!email || !otp || !newPassword) {
            return res.status(400).json({success:false, message:"Email, OTP, and newPassword are required"});
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
        }
        
        const normalizedEmail = email.trim().toLowerCase();

        const user: UserDoc | null = await UserModel.findOne({email: normalizedEmail});
        if (!user) {
            return res.status(400).json({success:false, message:"Invalid Request"});
        }

        if (!user.resetOtpExpires && !user.resetOtpHash) {
            return res.status(400).json({success:false, message:"Invalid Request"});
        }

        const ok: boolean = await verifyBothOtps(user, otp);
        if (!ok) {
            return res.status(400).json({success:false, message:"Invalid or Expired OTP"}); 
        }

        user.passwordHash = await bcrypt.hash(newPassword, Number(ENV.SALT_ROUNDS) || 10);
        user.resetOtpHash = null;
        user.resetOtpExpires = null;
        await user.save();

        return res.status(200).json({success:true, message:"Password reset successfully"});    

    } catch(err:any) {
        console.error("Failed to reset password", err);
        return res.status(500).json({success:false, message:"Failed to reset OTPs"})
    }
}