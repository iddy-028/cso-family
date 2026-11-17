import { Router } from "express";
import { listContent, updateContent } from "../controllers/contentController.js";
import { authenticate, requireRole } from "../middleware/auth.js";

const router = Router();

router.get("/", listContent);
router.put("/", authenticate, requireRole("admin"), updateContent);

export default router;
