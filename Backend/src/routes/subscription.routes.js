import express from 'express';
import { cancelSubscription, createSubscription,} from '../controllers/subscription.controller.js';
import { razorpayWebhook } from '../webhooks/razorpay.webhooks.js';
import protect from '../middleware/auth.middleware.js';
import { createOrder , verifyPayment} from '../controllers/subscription.controller.js';
const router = express.Router();

router.post("/create", protect, createSubscription);
router.post("/create-order", protect, createOrder);
router.post("/verify-payment", protect, verifyPayment);
router.post("/cancel", protect, cancelSubscription);

// no auth
router.post("/webhook", express.json({ type: "*/*" }), razorpayWebhook);
export default router;