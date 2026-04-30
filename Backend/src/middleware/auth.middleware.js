import jwt from 'jsonwebtoken';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import User from '../models/user.js'
 

const protect = asyncHandler(async (req,res, next)=>{
    let token;


    // ccheck if token is exists in header
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        token = req.headers.authorization.split(" ")[1];
    }
    if(!token){
        throw new ApiError(401, "Not authorized, no token")
    }

    try{
        // verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        req.user = await User.findById(decoded.id).select("-password");

        if(!req.user){
            throw new ApiError(401, "User not found")
        }

        next()
    }catch(error){
        throw new ApiError(401, "Not authorized, token failed")
    }
})



export default protect;