import express from "express";
import {
  initiatePayment,
  handlePaymobWebhook,
} from "../controllers/PaymentController";
import { createPaymentSession } from "../controllers/createPaymentSessionController";
import { verifyToken } from "../middlewares/authMiddleware";
import { ValidatedID } from "../middlewares/ValidateID";

const router = express.Router();

router.post("/session/:courseId", ValidatedID, createPaymentSession);

router.post("/initiate", verifyToken, initiatePayment);

router.post("/webhook", handlePaymobWebhook);

export default router;
