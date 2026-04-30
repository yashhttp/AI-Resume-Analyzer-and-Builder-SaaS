import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

const adminOnly = asyncHandler(async (req,res,next)=>{
    if(req.user && req.user.role=== "admin"){
        next();
    }else{
        throw new ApiError(403, "Acess denied. Admin Only")
    }
})
export default adminOnly;