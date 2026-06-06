import express from "express";

import upload from "../middleware/uploadMiddleware.js";
import protect from "../middleware/authMiddleware.js";

import {
  uploadResume,
  getResumeHistory,
  getResumeById,
  deleteResume,
} from "../controllers/resumeController.js";

const router = express.Router();

router.post(
  "/upload",
  protect,
  upload.single("resume"),
  uploadResume
);

router.get(
  "/history",
  protect,
  getResumeHistory
);

router.get(
  "/:id",
  protect,
  getResumeById
);

router.delete(
  "/:id",
  protect,
  deleteResume
);

export default router;