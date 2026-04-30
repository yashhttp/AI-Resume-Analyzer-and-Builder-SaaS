import express from "express"
import { getDashboardAnalytics } from "../controllers/admin.controller.js"
// import authMiddleware from "../middlewares/auth.middleware.js"
import protect from "../middleware/auth.middleware.js"
import roleMiddleware from "../middleware/role.middleware.js"
import {sendEmail} from "../utils/email.js"

const router = express.Router()

router.get(
  "/analytics",
  protect,
  roleMiddleware("admin"),
  getDashboardAnalytics
)
router.get("/mail", async (req,res)=>{
  await sendEmail(
    "yourpersonalemail@gmail.com",
    "Test Mail",
    "If you received this, email works!"
  )

  res.send("Mail sent")
})

export default router