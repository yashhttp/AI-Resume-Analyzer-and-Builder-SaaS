import fs from "fs";
import pdf from "pdf-parse/lib/pdf-parse.js";

import Analysis from "../models/analysis.model.js";
import { analyzeWithAi } from "../services/ai.services.js";
import Resume from "../models/resume.model.js";

import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import user from "../models/user.js";
import mongoose from "mongoose";

export const analyzeResume = asyncHandler(async (req, res) => {
  const { resumeId } = req.body;

  const resume = await Resume.findById(resumeId);
  if (!resume) {
    throw new ApiError(404, "Resume not found");
  }

  if (resume.user.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Not Authorized");
  }

  const mockResult = {
      score: Math.floor(Math.random()*40) + 60, //60-100
      atsScore:Math.floor(Math.random() *30)+70, //70-200
      strengths:["Good Formatting", "Relevant skills listed"],
      weaknesses:["Lack of quantified achievements"],
      suggestions:[
          "Add measurable Achievement",
          "Improve summary section"
      ]

  }
  const analysis = await Analysis.create({
      user:req.user._id,
      resume:resume._id,
      ...mockResult,
  })

  res
    .status(200)
    .json(new ApiResponse(200, "Resume analyzed successfully", analysis));
});

export const getMyAnalysis = asyncHandler(async (req, res) => {
    const analysis = await Analysis.find({ user: req.user._id })
    .populate("resume", "originalName fileSize createdAt")
    .sort({ createdAt : -1})
    res.status(200).json(
        new ApiResponse(200, "Analysis fetched successfully", analysis)
    )
})

export const deleteAnalysis = asyncHandler(async(req,res)=>{
    const analysis = await Analysis.findById(req.params.id)
    if(!analysis){
        throw new ApiError(404, "Analysis not found")

    }
    if(analysis.user.toString() !== req.user._id.toString()){
        throw new ApiError(403, "Not authorized to delete this analysis")
    }
    await analysis.deleteOne()
    res.status(200).json(
        new ApiResponse(200, "Analysis deleted successfully")
    )
})

export const getScoreTrend = asyncHandler(async(req,res)=>{
    try{
        const userId = req.user._id;
        const type = req.query.type || "raw";;

        // RAW DATA
        if(type === "raw"){
            const analysis = await Analysis.find({user:userId})
            .sort({createdAt:1})
            .select("score atsScore createdAt")
            const formatted= analysis.map((item)=>({
                date: item.createdAt.toISOString().split("T")[0],
                score:item.score
            }))
            return res.status(200).json(
                new ApiResponse(200, "Raw Score trend fetched successfully", formatted)
            )
        }


        // Daily Average
        if(type === "daily"){
            const trend = await Analysis.aggregate([
                {$match:{user: new mongoose.Types.ObjectId(userId)}},
                {$group:{
                    _id:{
                        year:{$year:"$createdAt"},
                        month:{$month:"$createdAt"},
                        day:{$dayOfMonth:"$createdAt"}
                    },
                    averageScore:{$avg:"$score"},
                    },
                },
            ])
            const formatted = trend.map((item)=>({
                date:`${item._id.year}-${item._id.month}-${item._id.day}`,
                score:Math.round(item.averageScore)
            }))

            return res.status(200).json(
                new ApiResponse(200, "Daily score trend fetched successfully", formatted)
            )
        }
        // ================= MONTHLY AVERAGE =================
    if (type === "monthly") {
      const trend = await Analysis.aggregate([
        { $match: { user: new mongoose.Types.ObjectId(userId) } },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
            },
            avgScore: { $avg: "$score" },
          },
        },
        {
          $sort: {
            "_id.year": 1,
            "_id.month": 1,
          },
        },
      ]);

      const formatted = trend.map((item) => ({
        date: `${item._id.year}-${item._id.month}`,
        score: Math.round(item.avgScore),
      }));

      return res
        .status(200)
        .json(new ApiResponse(200, "Monthly trend fetched successfully", formatted));
    }
    throw new ApiError(400, "Invalid trend type");

    }catch(err){
        console.error("Error fetching score trend", err);

    }
})

export const getImprovementAreas = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const analysis = await Analysis.find({ user: userId })
        .sort({ createdAt: 1 })
        .select("score createdAt");

    if (analysis.length < 2) {
        return res.status(200).json(
            new ApiResponse(200, "Not enough data to determine improvement areas", {
                improvementPercentage: 0,
                firstScore: analysis.length === 1 ? analysis[0].score : 0,
                latestScore: analysis.length === 1 ? analysis[0].score : 0,
                totalResume: analysis.length
            })
        );
    }
    
    const firstScore = analysis[0].score;
    const latestScore = analysis[analysis.length - 1].score;

    let improvementPercentage = 0;

    if (firstScore === 0) {
        improvementPercentage = latestScore > 0 ? 100 : 0;
    } else {
        const improvement = ((latestScore - firstScore) / firstScore) * 100;
        improvementPercentage = Number(improvement.toFixed(2));
    }

    return res.status(200).json(
        new ApiResponse(200, "Improvement calculated successfully", {
            firstScore,
            latestScore,
            improvementPercentage,
            totalResume: analysis.length
        })
    );
});
