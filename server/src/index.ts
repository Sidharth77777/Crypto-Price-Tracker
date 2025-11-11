import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import { connectDB, disconnectDB } from "./config/db";
import { ENV } from "./lib/env";
import authRoutes from "./routes/authRoutes";
import coinAlertRoutes from "./routes/coinAlertRoutes";
import fetchCoinRoutes from "./routes/fetchCoinRoutes";
import { authLimiter } from "./middleware/rateLimiter";
import { checkLogin } from "./middleware/checkLogin";
import "./services/coinUpdater";
import "./services/priceAlertCron"

const app = express();

app.use(cors({
    credentials: true,
    origin: [
        'http://localhost:3000',
        // ENV.FRONTEND_ORIGIN
        // ADD PRODUCTION URL TOO
    ],
    methods: ["GET","POST","PUT","DELETE","PATCH","OPTIONS"],
    allowedHeaders: ["Content-Type","Authorization"],
}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

app.get('/api', (req:Request, res:Response) => {
    void req;
    res.status(200).json({message: "Server running successfully and DB connected too.."})
})

app.use("/api/auth", authLimiter, authRoutes);

app.use("/api/coins", authLimiter, checkLogin , coinAlertRoutes);

app.use("/api/fetch", fetchCoinRoutes);

const PORT = ENV.PORT || 5000;

const runServer = async(): Promise<void> => {
    try{
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server is running on ${PORT}...`)
        }) 

    } catch(err:any) {
        console.error(`Failed to connect to server ${err}`);
        try { await disconnectDB(); } catch{};
        process.exit(1);
    }
}

runServer();