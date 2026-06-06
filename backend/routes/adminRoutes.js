import express from "express";

import protect from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import { getAdminStats } from "../controllers/adminController.js";

const router = express.Router();

router.get("/stats", protect, adminMiddleware, getAdminStats);

export default router;