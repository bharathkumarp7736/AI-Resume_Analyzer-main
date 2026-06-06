import fs from "fs";
import { PDFParse } from "pdf-parse";

import Resume from "../models/Resume.js";
import { analyzeResumeWithAI } from "../services/geminiService.js";

const getPlanLimit = (plan) => {
  if (plan === "pro") return 20;
  if (plan === "enterprise") return Infinity;
  return 3;
};

export const uploadResume = async (req, res) => {
  try {
    const plan = req.user.plan || "free";
    const limit = getPlanLimit(plan);

    const analysisCount = await Resume.countDocuments({
      user: req.user._id,
    });

    if (analysisCount >= limit) {
      return res.status(403).json({
        message: `Your ${plan} plan limit has been reached. Please upgrade to continue.`,
      });
    }

    const buffer = fs.readFileSync(req.file.path);

    const parser = new PDFParse({
      data: buffer,
    });

    const result = await parser.getText();

    const analysis = await analyzeResumeWithAI(result.text);

    const savedResume = await Resume.create({
      user: req.user._id,
      fileName: req.file.originalname,
      pdfText: result.text,
      analysis,
    });

    res.status(201).json({
      message: "Resume analyzed and saved successfully",
      resumeId: savedResume._id,
      analysis,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

export const getResumeHistory = async (req, res) => {
  try {
    const resumes = await Resume.find({
      user: req.user._id,
    })
      .sort({ createdAt: -1 })
      .select("fileName analysis createdAt");

    res.status(200).json({
      message: "Resume history fetched successfully",
      resumes,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!resume) {
      return res.status(404).json({
        message: "Resume not found",
      });
    }

    res.status(200).json({
      message: "Resume fetched successfully",
      resume,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!resume) {
      return res.status(404).json({
        message: "Resume not found",
      });
    }

    await Resume.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Resume deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};