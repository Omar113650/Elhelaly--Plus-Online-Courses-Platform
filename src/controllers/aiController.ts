import asyncHandler from "express-async-handler";
import { askGemini } from "../services/gemini";

export const askQuestionFromAI = asyncHandler(async (req, res) => {
  const { question } = req.body;

  if (!question) {
     res.status(400).json({ message: "يُرجى إرسال سؤال." });
     return;
  }

  const answer = await askGemini(question);
  res.json({ answer });
});
