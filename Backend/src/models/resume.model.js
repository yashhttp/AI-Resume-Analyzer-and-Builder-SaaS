import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    originalName:{
        type:String,
        required:true,
    },
    filePath:{
        type:String,
        required:true
    },
    fileSize:{
        type:Number,
        required:true
    },
    
},{timestamps:true})

export default mongoose.model("Resume", resumeSchema)