import { Router } from "express";
import * as ctrl from "../controllers/profileController.js";

const router = Router();
router.get("/stats", ctrl.stats);
export default router;
