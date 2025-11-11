import rateLimit from "express-rate-limit";

export const authLimiter = rateLimit({
    windowMs: 60*1000,
    max: 20,
    message: {
        success: false,
        message: "Too many attempts, please try again in 1 minute..."
    },
    standardHeaders: true, 
    legacyHeaders: false,
})