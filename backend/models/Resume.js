import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    fileName: {
      type: String,
      required: true,
    },

    pdfText: {
      type: String,
      required: true,
    },

    analysis: {
      atsScore: Number,
      summary: String,
      strongPoints: [String],
      weakPoints: [String],
      missingSkills: [String],
      resumeMistakes: [String],
      projectImprovements: [String],
      suggestedRoles: [String],
      interviewQuestions: [String],
    },
  },
  {
    timestamps: true,
  }
);

const Resume = mongoose.model("Resume", resumeSchema);

export default Resume;