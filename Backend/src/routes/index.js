import express from "express";
import ApiResponse from "../utils/ApiResponse.js";
import authRoutes from './auth.js';
import resumeRoutes from './resume.routes.js';
import analysisRoutes from './analysis.route.js';
import subscriptionRoutes from './subscription.routes.js';
import adminRoutes from './admin.routes.js';

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json(
    new ApiResponse(200, "API Working Properly 🚀")
  );
});

router.use("/auth", authRoutes);
router.use("/resume", resumeRoutes);
router.use("/analysis", analysisRoutes);
router.use("/subscription", subscriptionRoutes);
router.use("/admin", adminRoutes);

export default router;
