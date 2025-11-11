import { Router } from "express";
import { createAlert, deleteAlert, getAllAlerts, muteAlert, unMuteAlert, updateAlert } from "../controllers/coinAlertController";

const router = Router();

router.get("/getAll", getAllAlerts);

router.post("/create-alert", createAlert);

router.patch("/update-alert/:alertId", updateAlert); // updates trigger price

router.patch("/mute/:alertId", muteAlert);

router.patch("/unmute/:alertId", unMuteAlert);

router.delete("/delete/:alertId", deleteAlert);

export default router;