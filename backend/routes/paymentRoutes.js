import express from "express";
import protect from "../middleware/authMiddleware.js";

import {
  createCheckoutSession,
  updateUserPlan,
} from "../controllers/paymentController.js";

const router = express.Router();

router.post("/create-checkout-session", protect, createCheckoutSession);
router.put("/update-plan", protect, updateUserPlan);

export default router;