import { getProfileStats } from "../services/profile.js";

export function stats(req, res) {
  const userId = req.query.userId || "anonymous";
  const stats = getProfileStats(userId);
  res.json(stats);
}
