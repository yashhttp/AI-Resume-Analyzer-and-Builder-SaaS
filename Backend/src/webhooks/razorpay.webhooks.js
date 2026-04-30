import crypto from "crypto";
import User from "../models/user.js";
import Subscription from "../models/subscription.model.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

export const razorpayWebhook = asyncHandler(async (req, res) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const shasum = crypto.createHmac("sha256", secret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest("hex");

  if (digest !== req.headers["x-razorpay-signature"]) {
    return res.status(400).json({ message: "Invalid signature" });
  }
  const event = req.body.event;
  const payload = req.body.payload;

  if (event === "order.paid") {
    const entity = payload.order.entity;
    const { userId, plan } = entity.notes;

    if (userId && plan) {
      const expiryDays = plan === "YEARLY" ? 365 : 30; // Simplified for dev
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + expiryDays);

      await User.findByIdAndUpdate(userId, {
        plan: "PRO", // Generalizing to 'PRO' for access, but keeping track of specific plan
        detailedPlan: plan,
        subscriptionStatus: "ACTIVE",
        subscriptionExpiry: expiryDate,
      });
      console.log(`User ${userId} upgraded to ${plan} via Order`);
    }
  }

  if (event === "subscription.activated") {
    const entity = payload.subscription.entity;
    // ... existing subscription logic ...
    await Subscription.create({
      user: entity.notes.userId,
      razorpaySubscriptionId: entity.id,
      razorpayPlanId: entity.plan_id,
      status: entity.status,
      currentStart: new Date(entity.current_start * 1000),
      currentEnd: new Date(entity.current_end * 1000),
    });

    const user = await User.findById(entity.notes.userId);
    if (user) {
      await User.findByIdAndUpdate(entity.notes.userId, {
        plan: "PRO",
        subscriptionId: entity.id,
        subscriptionStatus: "ACTIVE",
        subscriptionExpiry: new Date(entity.current_end * 1000),
      });
    }
  }
  
  if (event === "subscription.cancelled") {
    const entity = payload.subscription.entity;
    // ... existing cancellation logic ...
    await User.findOneAndUpdate(
      { subscriptionId: entity.id },
      { subscriptionStatus: "CANCELLED", plan: "FREE" },
    );
  }

  res.json({ received: true });
});
