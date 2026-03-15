import "dotenv/config";

export default {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:3000",
  databaseUrl: process.env.DATABASE_URL || null,
  openaiApiKey: process.env.OPENAI_API_KEY || null,
  /** Use Docker for code execution (required in production). Set to false only for local dev without Docker. */
  useDockerExecution: process.env.USE_DOCKER_EXECUTION !== "false",
  /** Memory limit for execution container (e.g. "128m"). */
  executionMemoryLimit: process.env.EXECUTION_MEMORY_LIMIT || "128m",
  /** CPU time limit in seconds for execution. */
  executionTimeoutMs: Number(process.env.EXECUTION_TIMEOUT_MS) || 5000,
};
