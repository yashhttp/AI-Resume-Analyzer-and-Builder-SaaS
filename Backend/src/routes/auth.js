import express from 'express';
import protect from '../middleware/auth.middleware.js';
import { registerUser, loginUser, getProfile } from '../controllers/auth.js';
import adminOnly from '../middleware/admin.middleware.js';
import asyncHandler from '../utils/asyncHandler.js';
import User from '../models/user.js'
import ApiResponse from '../utils/ApiResponse.js';

const router = express.Router()

router.post("/register", registerUser)
router.post("/login", loginUser)
router.get("/profile", protect,getProfile)
router.put("/upgrade", protect, asyncHandler(async(req,res)=>{
    const user = await User.findById(req.user._id);

    user.plan = "PRO";
    await user.save()

    res.status(200).json(
        new ApiResponse(200, "Upgraded to Pro successfully", {
            plan:user.plan
        })
    )

}))

router.get("/admin", protect, adminOnly, (req,res)=>{
    res.json({
        sucess:true,
        message:"Welcome Admin"
    })
})
export default router;