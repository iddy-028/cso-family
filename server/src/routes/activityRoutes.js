import { Router } from "express";
import {
  createActivity,
  deleteActivity,
  getActivity,
  listActivities,
  updateActivity,
} from "../controllers/activitiesController.js";
import { authenticate, requireRole } from "../middleware/auth.js";
import { uploadImage } from "../middleware/upload.js";
import { cleanBody, required } from "../middleware/validate.js";

const router = Router();
const staffOnly = [authenticate, requireRole("admin", "staff")];

router.get("/", listActivities);
router.get("/:id", getActivity);

router.post(
  "/",
  ...staffOnly,
  uploadImage,
  cleanBody,
  required(["title", "description", "category"]),
  createActivity,
);

router.put("/:id", ...staffOnly, uploadImage, cleanBody, updateActivity);
router.delete("/:id", ...staffOnly, deleteActivity);

export default router;
