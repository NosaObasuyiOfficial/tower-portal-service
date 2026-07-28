import express from "express";
import { initializePayment, createAdmissionRecord } from "../serviceController/mutation";
import { verifyPayment } from "../serviceController/queries";

const router = express.Router();

router.post("/payments/initialize", initializePayment);
router.get("/payments/verify/:reference", verifyPayment);
router.post("/admission", createAdmissionRecord);

export default router;
