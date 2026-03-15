// In-memory store for submissions (for learning pattern detection / history).
// In production, replace with PostgreSQL.

const submissions = [];
const submissionIdCounter = { next: 1 };

export function createSubmission(data) {
  const id = String(submissionIdCounter.next++);
  const record = {
    id,
    problemId: data.problemId,
    userId: data.userId || "anonymous",
    code: data.code,
    status: data.status, // "accepted" | "wrong_answer" | "error" | "timeout"
    stdout: data.stdout ?? "",
    stderr: data.stderr ?? "",
    runtimeMs: data.runtimeMs ?? null,
    createdAt: new Date().toISOString(),
  };
  submissions.push(record);
  return record;
}

export function getSubmissionsByProblem(problemId, userId = "anonymous") {
  return submissions
    .filter((s) => s.problemId === problemId && s.userId === userId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export function getSubmissionsByUser(userId) {
  return submissions
    .filter((s) => s.userId === userId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}
