import "dotenv/config";

export default {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:3000",
  databaseUrl: process.env.DATABASE_URL || null,
  openaiApiKey: process.env.OPENAI_API_KEY || null,
};
