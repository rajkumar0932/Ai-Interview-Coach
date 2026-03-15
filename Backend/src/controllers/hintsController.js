import { getHint } from "../services/hints.js";

export function get(req, res) {
  const { problemId, index } = req.query;
  if (!problemId) return res.status(400).json({ error: "problemId is required" });
  const hint = getHint(problemId, index);
  if (!hint) return res.status(404).json({ error: "Hint not found" });
  res.json(hint);
}
