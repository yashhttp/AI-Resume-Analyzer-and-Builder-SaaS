import express from "express";
import protect from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";
import { uploadResume, getMyResumes, deleteResume } from "../controllers/resume.controller.js";

const router = express.Router()

router.post("/upload", protect, upload.single("resume"), uploadResume);
router.get("/my", protect, getMyResumes );

router.delete("/:id", protect, deleteResume)


export default router;