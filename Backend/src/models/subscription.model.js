import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    razorpaySubscriptionId: {
      type: String,
      unique: true,
    },
    razorpayPlanId: String,
    status: String,
    currentStart: Date,
    currentEnd: Date,
    cancelAtPeriodEnd: Boolean,
  },
  { timestamps: true }
);

export default mongoose.model("Subscription", subscriptionSchema);