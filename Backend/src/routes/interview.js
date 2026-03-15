import { Router } from "express";
import * as ctrl from "../controllers/interviewController.js";

const router = Router();
router.post("/question", ctrl.question);
router.post("/reply", ctrl.reply);
router.get("/recommendations", ctrl.recommendations);
export default router;
