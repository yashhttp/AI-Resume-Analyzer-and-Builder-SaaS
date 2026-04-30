import User from "../models/user.js"
import Resume from "../models/resume.model.js"
import Subscription from "../models/subscription.model.js"

export const getDashboardAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalResumes = await Resume.countDocuments();

    // 1. Calculate Recurring Revenue from Subscriptions
    const activeSubscriptions = await Subscription.find({ status: "active" });
    let recurringRevenue = 0;
    activeSubscriptions.forEach(sub => {
      if (sub.razorpayPlanId === process.env.RAZORPAY_WEEKLY_PLAN_ID) recurringRevenue += 49;
      if (sub.razorpayPlanId === process.env.RAZORPAY_MONTHLY_PLAN_ID) recurringRevenue += 149;
      if (sub.razorpayPlanId === process.env.RAZORPAY_YEARLY_PLAN_ID) recurringRevenue += 999;
    });

    // 2. Calculate One-time Revenue from Pro Users who don't have a recurring subscription
    // These are users who paid via Order API (one-time)
    const oneTimeProUsers = await User.find({
      plan: "PRO",
      subscriptionId: { $regex: /^order_/ } // IDs starting with order_
    });

    let oneTimeRevenue = 0;
    const planPrices = { WEEKLY: 49, MONTHLY: 149, YEARLY: 999 };
    
    oneTimeProUsers.forEach(user => {
      const price = planPrices[user.detailedPlan] || 0;
      oneTimeRevenue += price;
    });

    const totalRevenue = recurringRevenue + oneTimeRevenue;
    const premiumUsersCount = await User.countDocuments({ plan: "PRO" });
    
    // Subscriptions stats
    const activeSubCount = activeSubscriptions.length;
    const cancelledSubCount = await Subscription.countDocuments({ status: "cancelled" });

    // 3. Fetch Recent Users (Latest 10)
    const recentUsers = await User.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .select("name email plan role createdAt");

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        premiumUsers: premiumUsersCount,
        totalResumes,
        totalRevenue,
        activeSubscriptions: activeSubCount,
        expiredSubscriptions: cancelledSubCount,
        recentUsers,
        breakdown: {
            recurring: recurringRevenue,
            oneTime: oneTimeRevenue
        }
      }
    });
  } catch (error) {
    console.error("Analytics Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard analytics"
    });
  }
};