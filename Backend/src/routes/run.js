import { Router } from "express";
import * as ctrl from "../controllers/runController.js";

const router = Router();
router.post("/", ctrl.run);
export default router;
