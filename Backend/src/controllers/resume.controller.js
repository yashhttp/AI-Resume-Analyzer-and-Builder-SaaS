import Resume from '../models/resume.model.js';
import User from '../models/user.js'
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';
import fs from 'fs';
import path from 'path';


export const uploadResume = asyncHandler(async(req, res)=>{
    if(!req.file){
        throw new ApiError(400, "No file uploaded")

    }
    if (req.user.plan.toLowerCase() === "free" && req.user.usageCount >= 3) {
        throw new ApiError(403, "Free plan limit reached. Please upgrade to Pro for unlimited uploads.");
    }

    const resume = await Resume.create({
        user:req.user._id,
        originalName:req.file.originalname,
        filePath:req.file.path,
        fileSize:req.file.size
    });
    // increment uasge
    await User.findByIdAndUpdate(req.user._id,{$inc:{usageCount:1}
    })
    
    res.status(200).json(
        new ApiResponse(201, "resume upload successfully", resume)
    )
});

export const getMyResumes = asyncHandler(async(req,res)=>{
    const resumes = await Resume.find({user: req.user._id});
    res.status(200).json(
        new ApiResponse(200, "Resume successfully fetched", resumes)
    )
})

export const deleteResume = asyncHandler(async(req, res)=>{
    const resume = await Resume.findById(req.params.id)

    if(!resume){
        throw new ApiError(404, "Resume not found")
    }
    // ownership check
    if(resume.user.toString() !== req.user._id.toString()){
        throw new ApiError(403, "Not authorized to delete this resume")
    }

    // delete resume from storage
    const absolutePath = path.resolve(resume.filePath);
    if(fs.existsSync(absolutePath)){
        fs.unlinkSync(absolutePath)
        console.log(`Deleted file: ${absolutePath}`);
    } else {
        console.warn(`File not found for deletion: ${absolutePath}`);
    }
    await resume.deleteOne()

    res.status(200).json(
        new ApiResponse(200, "Resume delete successfully")
    )
})