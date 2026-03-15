import { getAllProblems, getProblemById } from "../models/problems.js";

export function list(req, res) {
  const { difficulty, topic } = req.query;
  const problems = getAllProblems({ difficulty, topic });
  res.json({ problems });
}

export function getById(req, res) {
  const problem = getProblemById(req.params.id);
  if (!problem) return res.status(404).json({ error: "Problem not found" });
  res.json(problem);
}
