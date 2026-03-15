import express from "express";
import cors from "cors";
import config from "./config/index.js";
import problemsRouter from "./routes/problems.js";
import runRouter from "./routes/run.js";
import hintsRouter from "./routes/hints.js";
import interviewRouter from "./routes/interview.js";
import profileRouter from "./routes/profile.js";

const app = express();

app.use(cors({ origin: config.corsOrigin }));
app.use(express.json());

app.use("/api/problems", problemsRouter);
app.use("/api/run", runRouter);
app.use("/api/hints", hintsRouter);
app.use("/api/interview", interviewRouter);
app.use("/api/profile", profileRouter);

app.get("/api/health", (req, res) => res.json({ ok: true }));

export default app;