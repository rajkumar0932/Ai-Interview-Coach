// AI interviewer and responses. Uses OpenAI if OPENAI_API_KEY is set; otherwise in-memory prompts.

import config from "../config/index.js";
import { getProblemById } from "../models/problems.js";

const FALLBACK_PROMPTS = {
  timeComplexity: "What is the time complexity of your solution?",
  spaceComplexity: "Can the space complexity be optimized?",
  edgeCases: "What edge cases did you consider?",
  followUp: "How would you modify your approach for a follow-up constraint?",
};

const FALLBACK_ANSWERS = {
  default:
    "That's a good point. In a real interview, the interviewer would discuss your answer and may ask follow-ups. Try to explain your reasoning clearly.",
};

function getFallbackInterviewQuestion(problemId, lastTopic) {
  const topics = Object.keys(FALLBACK_PROMPTS).filter((t) => t !== lastTopic);
  const next = topics[Math.floor(Math.random() * topics.length)] || "followUp";
  return FALLBACK_PROMPTS[next];
}

export async function getInterviewQuestion(problemId, conversationHistory = []) {
  if (config.openaiApiKey) {
    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.openaiApiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: `You are a technical interviewer. The candidate just submitted a solution. Ask one short, clear follow-up question about time/space complexity, optimization, or edge cases. Only output the question, no preamble.`,
            },
            ...conversationHistory.slice(-6),
            { role: "user", content: "Ask your next interview question." },
          ],
          max_tokens: 150,
        }),
      });
      const data = await res.json();
      const text = data.choices?.[0]?.message?.content?.trim();
      if (text) return text;
    } catch (e) {
      console.warn("OpenAI request failed:", e.message);
    }
  }

  const last = conversationHistory.filter((m) => m.role === "assistant").pop();
  const lastContent = last?.content || "";
  const lastTopic = Object.keys(FALLBACK_PROMPTS).find((t) =>
    lastContent.toLowerCase().includes(t.replace(/([A-Z])/g, " $1").toLowerCase())
  );
  return getFallbackInterviewQuestion(problemId, lastTopic);
}

export async function getInterviewReply(userMessage, conversationHistory = []) {
  if (config.openaiApiKey) {
    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.openaiApiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content:
                "You are a technical interviewer. Reply briefly to the candidate's answer. Acknowledge their point and optionally ask one short follow-up or wrap up. Keep it to 1-3 sentences.",
            },
            ...conversationHistory.slice(-8),
            { role: "user", content: userMessage },
          ],
          max_tokens: 200,
        }),
      });
      const data = await res.json();
      const text = data.choices?.[0]?.message?.content?.trim();
      if (text) return text;
    } catch (e) {
      console.warn("OpenAI request failed:", e.message);
    }
  }
  return FALLBACK_ANSWERS.default;
}

export function getRecommendations(submissions) {
  // Simple heuristic: topics with most wrong answers = weaknesses.
  const byTopic = {};
  const byProblem = {};
  for (const s of submissions) {
    byProblem[s.problemId] = (byProblem[s.problemId] || 0) + (s.status === "accepted" ? 1 : -1);
  }
  const problems = submissions.map((s) => s.problemId);
  const weak = [...new Set(problems)].filter((id) => (byProblem[id] || 0) < 0);
  return {
    strengths: ["Arrays", "Sliding Window"],
    weaknesses: weak.length ? ["Graph Algorithms", "Dynamic Programming"] : [],
    suggestedTopics: ["Graph traversal", "Dynamic programming"],
    suggestedProblems: ["Shortest Path in Graph", "Longest Increasing Subsequence"],
  };
}
