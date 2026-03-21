import config from "../config/index.js";

/**
 * Meaningful Problem Fallbacks (Rule #7): 
 * Used when no LLM is available to ensure the user still gets a conversational experience.
 */
const FALLBACK_PROMPTS = {
  timeComplexity: "Can you explain the Big-O time complexity of your solution?",
  spaceComplexity: "How does the memory usage scale as the input size grows?",
  edgeCases: "How would your current logic handle null inputs or extremely large integers?",
  optimization: "Is there a bottleneck in your approach that could be optimized to a better time complexity?",
};

/**
 * Rule #2 Compliance: Primary attempt uses Ollama (Local/Open Source).
 * Secondary attempt uses OpenAI if configured.
 * Final fallback uses deterministic logic.
 */
export async function getInterviewQuestion(problemId, conversationHistory = []) {
  const prompt = "You are a technical interviewer. The candidate just submitted a solution. Ask one short, clear follow-up question about time/space complexity, optimization, or edge cases. Only output the question, no preamble.";

  // 1. TRY OLLAMA (Local Open Source - Best for Hackathon Rule #2)
  try {
    const ollamaRes = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      body: JSON.stringify({
        model: "llama3", // Or mistral
        prompt: `${prompt}\n\nHistory: ${JSON.stringify(conversationHistory.slice(-5))}`,
        stream: false,
      }),
    });
    if (ollamaRes.ok) {
      const data = await ollamaRes.json();
      return data.response.trim();
    }
  } catch (e) {
    console.log("Ollama not running, trying OpenAI...");
  }

  // 2. TRY OPENAI (Proprietary - Use only as backup)
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
            { role: "system", content: prompt },
            ...conversationHistory.slice(-6),
          ],
          max_tokens: 100,
        }),
      });
      const data = await res.json();
      return data.choices?.[0]?.message?.content?.trim();
    } catch (e) {
      console.warn("OpenAI failed:", e.message);
    }
  }

  // 3. DETERMINISTIC FALLBACK (Ensures Rule #7 quality without an API)
  const lastAssistantMsg = conversationHistory.filter(m => m.role === 'assistant').pop()?.content || "";
  const remainingTopics = Object.keys(FALLBACK_PROMPTS).filter(topic => 
    !lastAssistantMsg.toLowerCase().includes(topic.replace(/([A-Z])/g, " $1").toLowerCase())
  );
  
  const selectedTopic = remainingTopics[Math.floor(Math.random() * remainingTopics.length)] || "timeComplexity";
  return FALLBACK_PROMPTS[selectedTopic];
}

export async function getInterviewReply(message, conversationHistory = []) {
  const prompt = "You are a technical interviewer. Respond to the candidate's message in a conversational, helpful way. Keep responses concise and focused on coding interview topics.";

  // 1. TRY OLLAMA (Local Open Source - Best for Hackathon Rule #2)
  try {
    const ollamaRes = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      body: JSON.stringify({
        model: "llama3", // Or mistral
        prompt: `${prompt}\n\nUser: ${message}\n\nHistory: ${JSON.stringify(conversationHistory.slice(-5))}`,
        stream: false,
      }),
    });
    if (ollamaRes.ok) {
      const data = await ollamaRes.json();
      return data.response.trim();
    }
  } catch (e) {
    console.log("Ollama not running, trying OpenAI...");
  }

  // 2. TRY OPENAI (Proprietary - Use only as backup)
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
            { role: "system", content: prompt },
            ...conversationHistory.slice(-6),
            { role: "user", content: message },
          ],
          max_tokens: 150,
        }),
      });
      const data = await res.json();
      return data.choices?.[0]?.message?.content?.trim();
    } catch (e) {
      console.warn("OpenAI failed:", e.message);
    }
  }

  // 3. DETERMINISTIC FALLBACK (Ensures Rule #7 quality without an API)
  return "That's a good point! Can you elaborate on your approach to handling edge cases in this problem?";
}
export function getRecommendations(submissions = []) {
  if (!submissions.length) {
    return {
      strengths: ["None yet"],
      weaknesses: ["Start practicing!"],
      suggestedTopics: ["Arrays", "Strings"],
      suggestedProblems: ["Two Sum", "Valid Parentheses"]
    };
  }

  const stats = submissions.reduce((acc, s) => {
    const topic = s.topic || "General";
    acc[topic] = acc[topic] || { pass: 0, total: 0 };
    acc[topic].total++;
    if (s.status === 'accepted') acc[topic].pass++;
    return acc;
  }, {});

  const weaknesses = Object.keys(stats).filter(t => (stats[t].pass / stats[t].total) < 0.6);
  const strengths = Object.keys(stats).filter(t => (stats[t].pass / stats[t].total) >= 0.8);

  // Map weaknesses to suggested problems (Can be expanded with a real problem model)
  const topicToProblem = {
    "Dynamic Programming": "Longest Increasing Subsequence",
    "Graph Algorithms": "Shortest Path in Graph",
    "Arrays": "Merge Sorted Array",
    "Sliding Window": "Longest Substring Without Repeating Characters"
  };

  return {
    strengths: strengths.length ? strengths : ["Building data..."],
    weaknesses: weaknesses.length ? weaknesses : ["No major gaps found"],
    suggestedTopics: weaknesses.slice(0, 2),
    suggestedProblems: weaknesses.map(w => topicToProblem[w]).filter(Boolean).slice(0, 2)
  };
}
