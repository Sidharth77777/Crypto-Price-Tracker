import { Router } from "express";
import { forgotPassword, loginUser, registerUser, resetPassword, verifyOTP } from "../controllers/authController";

const router = Router();

router.post('/register', registerUser),

router.post('/login', loginUser);

router.post('/forgot-password', forgotPassword);

router.post('/verify-otp', verifyOTP);

router.post('/reset-password', resetPassword);

export default router;