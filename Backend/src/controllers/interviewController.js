import { getInterviewQuestion, getInterviewReply, getRecommendations } from "../services/ai.js";
import { getSubmissionsByUser } from "../models/submissions.js";

export async function question(req, res) {
  try {
    const { problemId, history } = req.body;
    if (!problemId) return res.status(400).json({ error: "problemId is required" });
    const question = await getInterviewQuestion(problemId, history || []);
    res.json({ question });
  } catch (err) {
    console.error("Interview question error:", err);
    res.status(500).json({ error: "Failed to get question" });
  }
}

export async function reply(req, res) {
  try {
    const { message, history } = req.body;
    if (!message) return res.status(400).json({ error: "message is required" });
    const reply = await getInterviewReply(message, history || []);
    res.json({ reply });
  } catch (err) {
    console.error("Interview reply error:", err);
    res.status(500).json({ error: "Failed to get reply" });
  }
}

export function recommendations(req, res) {
  const userId = req.query.userId || "anonymous";
  const submissions = getSubmissionsByUser(userId);
  const rec = getRecommendations(submissions);
  res.json(rec);
}
