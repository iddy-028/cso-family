import { Router } from "express";
import { dashboardStats } from "../controllers/statsController.js";
import { authenticate, requireRole } from "../middleware/auth.js";

const router = Router();

router.get("/", authenticate, requireRole("admin", "staff"), dashboardStats);

export default router;
