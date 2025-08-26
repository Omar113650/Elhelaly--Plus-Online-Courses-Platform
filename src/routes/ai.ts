// routes/ai.ts
import express from "express";
import asyncHandler from "express-async-handler";
import { askAI } from "../services/aiHelper";
import { askQuestionFromAI } from "../controllers/aiController";
const router = express.Router();

// @desc    Ask AI for help
// @route   POST /api/ai
// @access  Public (أو غيّرها حسب الـ RBAC)
router.post(
  "/",
  asyncHandler(async (req, res) => {
    const { question } = req.body;

    if (!question) {
       res.status(400).json({ message: "يرجى إرسال سؤال." });
       return;
    }

    const answer = await askAI(question);
    res.json({ answer });
  })
);

router.post("/ask", askQuestionFromAI);

export default router;
