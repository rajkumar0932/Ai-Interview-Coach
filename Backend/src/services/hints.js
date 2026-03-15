import { getProblemById } from "../models/problems.js";

export function getHint(problemId, hintIndex) {
  const problem = getProblemById(problemId);
  if (!problem || !problem.hints) return null;
  const index = Math.min(Number(hintIndex) || 0, problem.hints.length - 1);
  return {
    index,
    total: problem.hints.length,
    text: problem.hints[index],
  };
}
