import { Router } from "express";
import { createVideo, deleteVideo, listVideos } from "../controllers/videoController.js";
import { authenticate, requireRole } from "../middleware/auth.js";
import { uploadVideo } from "../middleware/upload.js";
import { cleanBody } from "../middleware/validate.js";

const router = Router();
const staffOnly = [authenticate, requireRole("admin", "staff")];

router.get("/", listVideos);
router.post("/", ...staffOnly, uploadVideo, cleanBody, createVideo);
router.delete("/:id", ...staffOnly, deleteVideo);

export default router;
