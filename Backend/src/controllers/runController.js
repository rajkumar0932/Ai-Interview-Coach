import { runCode } from "../services/execute.js";
import { createSubmission } from "../models/submissions.js";
import { getProblemById } from "../models/problems.js";

export async function run(req, res) {
  try {
    const { code, problemId, testCases } = req.body;
    if (!code || !problemId) {
      return res.status(400).json({ error: "code and problemId are required" });
    }
    if (!getProblemById(problemId)) {
      return res.status(404).json({ error: "Problem not found" });
    }
    const result = await runCode(code, problemId, testCases);
    const submission = createSubmission({
      problemId,
      userId: req.body.userId || "anonymous",
      code,
      status: result.status,
      stdout: result.stdout,
      stderr: result.stderr,
      runtimeMs: result.runtimeMs,
    });
    res.json({
      submissionId: submission.id,
      status: result.status,
      stdout: result.stdout,
      stderr: result.stderr,
      runtimeMs: result.runtimeMs,
      results: result.results,
    });
  } catch (err) {
    console.error("Run error:", err);
    res.status(500).json({ error: "Execution failed", message: err.message });
  }
}
