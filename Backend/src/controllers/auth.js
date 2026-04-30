// import User from "../models/User.js";
import User from "../models/user.js";

import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/email.js"
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};
console.log("JWT_SECRET:", process.env.JWT_SECRET);
// Register
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    throw new ApiError(400, "All feild are required");
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new ApiError(400, "User Already Exists");
  }
  const user = await User.create({ name, email, password });
  res.status(200).json(
    new ApiResponse(201, "User Registered Successfully", {
      _id: user._id,
      name: user.name,
      email: user.email,
      role:user.role,
      token: generateToken(user._id),
    }),
  );
  await sendEmail(
  user.email,
  "Welcome to AI Resume Analyzer 🎉",
  `Hi ${user.name}, your account has been created successfully.`
);

});


// Login
export const loginUser = asyncHandler(async(req, res)=>{
    const {email, password} = req.body

    const user = await User.findOne({email})

    if(!user || !(await user.comparePassword(password))){
        throw new ApiError(401, "Invalid email and password")
    }

    res.status(200).json(
        new ApiResponse(201, "Login Successfully", {
            _id : user._id,
            name:user.name,
            email:user.email,
            role:user.role,
            token:generateToken(user._id)

        })
    )
})

import Resume from "../models/resume.model.js";
import Analysis from "../models/analysis.model.js";

//Profile
export const getProfile = asyncHandler(async (req, res) => {
  const [totalResumes, totalAnalysis] = await Promise.all([
    Resume.countDocuments({ user: req.user._id }),
    Analysis.countDocuments({ user: req.user._id })
  ]);

  res.status(200).json(
    new ApiResponse(200, "Profile fetched successfully", {
      _id:req.user._id,
      name:req.user.name,
      email:req.user.email,
      role:req.user.role,
      plan:req.user.plan,
      subscriptionStatus: req.user.subscriptionStatus,
      usageCount:req.user.usageCount,
      totalResumes,
      totalAnalysis,
      remainingUploads:
      req.user.plan.toLowerCase() === "free" ? 3 - req.user.usageCount : "Unlimited",
    })
  );
});


