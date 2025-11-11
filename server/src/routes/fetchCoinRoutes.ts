import { Router } from "express";
import { fetchCoinData } from "../controllers/fetchCoin";

const router = Router();

router.post('/coin', fetchCoinData);

export default router;