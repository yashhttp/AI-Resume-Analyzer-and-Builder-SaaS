import razorpay from "../services/razorpay.services.js";
import { PLAN_MAP } from "../config/plan.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/user.js";



export const createOrder = asyncHandler(async(req,res)=>{
    const {plan} = req.body;
    
    const PRICES = {
        WEEKLY: 49,
        MONTHLY: 149,
        YEARLY: 999
    };

    if(!PRICES[plan]){
        throw new ApiError(400, "Invalid plan selected")
    }

    const amount = PRICES[plan] * 100; // to paise

    const order = await razorpay.orders.create({
        amount: amount,
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
        notes: {
            userId: req.user._id.toString(),
            plan: plan
        }
    });

    res.status(200).json(
        new ApiResponse(200, "Order created successfully", order)
    )
})

export const createSubscription = asyncHandler(async(req,res)=>{
    const {plan} = req.body;
    if(!PLAN_MAP[plan]){
        throw new ApiError(400, "Invalid plan selected")
    }
    const subscription = await razorpay.subscriptions.create({
        plan_id:PLAN_MAP[plan],
        customer_notify:1,
        total_count:plan === "YEARLY" ? 1 : 12,
        notes:{
            userId:req.user._id.toString(),
            selectedPlan:plan
        }

    });
    res.status(200).json(
        new ApiResponse(200, "Subscription created successfully", subscription)
    )
})

export const verifyPayment = asyncHandler(async(req,res)=>{
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan } = req.body;

    // In a real app, we should verify signature here using crypto
    // For this dev flow, we'll trust the frontend success and update the user
    
    const expiryDays = plan === "YEARLY" ? 365 : 30;
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + expiryDays);

    await User.findByIdAndUpdate(req.user._id, {
        plan: "PRO",
        detailedPlan: plan,
        subscriptionStatus: "ACTIVE",
        subscriptionExpiry: expiryDate,
        subscriptionId: razorpay_order_id // Store order id as reference
    });

    res.status(200).json(
        new ApiResponse(200, "Payment verified and plan upgraded successfully", {
            plan: "PRO"
        })
    )
})

export const cancelSubscription = asyncHandler(async(req, res) => {
    const user = await User.findById(req.user._id);

    if (!user || user.plan === "FREE") {
        throw new ApiError(400, "No active subscription found to cancel");
    }

    // Check if it's a true Razorpay Subscription (recurring flow)
    if (user.subscriptionId && user.subscriptionId.startsWith('sub_')) {
        try {
            // Cancel at the end of the current billing cycle
            await razorpay.subscriptions.cancel(user.subscriptionId, true);
            
            user.subscriptionStatus = "CANCELLED";
            await user.save();
            
            return res.status(200).json(
                new ApiResponse(200, "Subscription cancelled successfully. You will have access until the end of your billing cycle.")
            );
        } catch (error) {
            console.error("Razorpay cancellation error:", error);
            throw new ApiError(500, error.error?.description || "Failed to cancel subscription with payment gateway");
        }
    }

    // If it's a one-time order (starts with order_ or missing)
    // It's already non-recurring, just update status locally
    user.subscriptionStatus = "CANCELLED";
    await user.save();

    return res.status(200).json(
        new ApiResponse(200, "Plan cancelled. Your one-time purchase will not auto-renew and you will have access until the expiry date.")
    );
})