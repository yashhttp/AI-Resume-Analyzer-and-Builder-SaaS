import express from 'express';
import protect from '../middleware/auth.middleware.js';
import { analyzeResume, getMyAnalysis, deleteAnalysis, getScoreTrend, getImprovementAreas } from '../controllers/analysis.controller.js';

const router = express.Router();

router.post("/analyze", protect, analyzeResume);
router.get("/my", protect, getMyAnalysis);
router.delete("/delete/:id", protect, deleteAnalysis);
router.get("/trend", protect, getScoreTrend)
router.get("/improvement",protect, getImprovementAreas)
router.get("/improvement",protect, getImprovementAreas)
router.get("/improvement",protect, getImprovementAreas)
router.get("/improvement",protect, getImprovementAreas)
router.get("/improvement",protect, getImprovementAreas)

export default router;