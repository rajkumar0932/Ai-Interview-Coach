import { getSubmissionsByUser } from "../models/submissions.js";
import { getProblemById } from "../models/problems.js";

/**
 * Build profile stats for a user: activity by date, by topic (strengths/weaknesses), recent submissions.
 */
export function getProfileStats(userId) {
  const submissions = getSubmissionsByUser(userId);
  const totalSubmissions = submissions.length;
  const accepted = submissions.filter((s) => s.status === "accepted");
  const problemsSolvedSet = new Set(accepted.map((s) => s.problemId));
  const problemsSolved = problemsSolvedSet.size;

  // By topic: { topic: { attempted, accepted, acceptanceRate } }
  const byTopic = {};
  for (const s of submissions) {
    const problem = getProblemById(s.problemId);
    const topic = problem?.topic || "Other";
    if (!byTopic[topic]) {
      byTopic[topic] = { attempted: 0, accepted: 0 };
    }
    byTopic[topic].attempted += 1;
    if (s.status === "accepted") byTopic[topic].accepted += 1;
  }
  const topics = Object.entries(byTopic).map(([name, data]) => ({
    topic: name,
    ...data,
    acceptanceRate: data.attempted
      ? Math.round((data.accepted / data.attempted) * 100)
      : 0,
  }));

  // Strengths: topics with acceptance rate >= 60% and at least 1 accepted
  const strengths = topics
    .filter((t) => t.acceptanceRate >= 60 && t.accepted > 0)
    .sort((a, b) => b.acceptanceRate - a.acceptanceRate)
    .slice(0, 6);

  // Weaknesses: topics with acceptance rate < 60% or most attempts without success
  const weaknesses = topics
    .filter((t) => t.acceptanceRate < 60 || (t.attempted >= 1 && t.accepted === 0))
    .sort((a, b) => a.acceptanceRate - b.acceptanceRate)
    .slice(0, 6);

  // Activity by date (last 12 weeks for heatmap)
  const activityByDate = {};
  const now = new Date();
  for (let i = 0; i < 84; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() - (83 - i));
    const key = d.toISOString().slice(0, 10);
    activityByDate[key] = 0;
  }
  for (const s of submissions) {
    const key = s.createdAt.slice(0, 10);
    if (activityByDate[key] !== undefined) activityByDate[key]++;
  }

  // Recent activity (last 15 submissions with problem title)
  const recentActivity = submissions.slice(0, 15).map((s) => {
    const problem = getProblemById(s.problemId);
    return {
      id: s.id,
      problemId: s.problemId,
      problemTitle: problem?.title || "Unknown",
      status: s.status,
      runtimeMs: s.runtimeMs,
      createdAt: s.createdAt,
    };
  });

  return {
    totalSubmissions,
    problemsSolved,
    acceptedCount: accepted.length,
    byTopic: topics,
    strengths,
    weaknesses,
    activityByDate,
    recentActivity,
  };
}
