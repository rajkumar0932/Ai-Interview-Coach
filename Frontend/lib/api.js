const API = "/api";

export async function getProblems(filters = {}) {
  const q = new URLSearchParams(filters).toString();
  const res = await fetch(`${API}/problems${q ? `?${q}` : ""}`);
  if (!res.ok) throw new Error("Failed to fetch problems");
  return res.json();
}

export async function getProblem(id) {
  const res = await fetch(`${API}/problems/${id}`);
  if (!res.ok) throw new Error("Failed to fetch problem");
  return res.json();
}

export async function runCode(problemId, code, userId = "anonymous") {
  const res = await fetch(`${API}/run`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ problemId, code, userId }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Run failed");
  return data;
}

export async function getHint(problemId, index = 0) {
  const res = await fetch(`${API}/hints?problemId=${problemId}&index=${index}`);
  if (!res.ok) throw new Error("Failed to get hint");
  return res.json();
}

export async function getInterviewQuestion(problemId, history = []) {
  const res = await fetch(`${API}/interview/question`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ problemId, history }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to get question");
  return data;
}

export async function getInterviewReply(message, history = []) {
  const res = await fetch(`${API}/interview/reply`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, history }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to get reply");
  return data;
}

export async function getRecommendations(userId = "anonymous") {
  const res = await fetch(`${API}/interview/recommendations?userId=${userId}`);
  if (!res.ok) throw new Error("Failed to get recommendations");
  return res.json();
}

export async function getProfileStats(userId) {
  const res = await fetch(`${API}/profile/stats?userId=${encodeURIComponent(userId)}`);
  if (!res.ok) throw new Error("Failed to load profile");
  return res.json();
}
