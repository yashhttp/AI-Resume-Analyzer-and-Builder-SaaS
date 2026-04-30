import mongoose from "mongoose";

const analysisSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    resume:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Resume",
        required:true
    },
    score:{
        type:Number,
        required:true
    },
    atsScore:{
        type:Number,
        required:true
    },
    strengths:[String],
    weaknesses:[String],
    suggestions:[String],
    feedback:Object
},{timestamps:true})

export default mongoose.model("Analysis", analysisSchema)