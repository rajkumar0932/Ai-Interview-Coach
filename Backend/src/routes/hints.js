import { Router } from "express";
import * as ctrl from "../controllers/hintsController.js";

const router = Router();
router.get("/", ctrl.get);
export default router;
