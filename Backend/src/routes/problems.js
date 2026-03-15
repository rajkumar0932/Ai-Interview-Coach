import { Router } from "express";
import * as ctrl from "../controllers/problemsController.js";

const router = Router();
router.get("/", ctrl.list);
router.get("/:id", ctrl.getById);
export default router;
