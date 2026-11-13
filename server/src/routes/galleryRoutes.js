import { Router } from "express";
import {
  createGalleryItem,
  deleteGalleryItem,
  listGallery,
  updateGalleryItem,
} from "../controllers/galleryController.js";
import { authenticate, requireRole } from "../middleware/auth.js";
import { uploadImage } from "../middleware/upload.js";
import { cleanBody, required } from "../middleware/validate.js";

const router = Router();
const staffOnly = [authenticate, requireRole("admin", "staff")];

router.get("/", listGallery);
router.post("/", ...staffOnly, uploadImage, cleanBody, required(["title"]), createGalleryItem);
router.put("/:id", ...staffOnly, uploadImage, cleanBody, updateGalleryItem);
router.delete("/:id", ...staffOnly, deleteGalleryItem);

export default router;
