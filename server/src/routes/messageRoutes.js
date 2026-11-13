import { Router } from "express";
import {
  createMessage,
  deleteMessage,
  listMessages,
  markMessageRead,
} from "../controllers/messagesController.js";
import { authenticate, requireRole } from "../middleware/auth.js";
import { cleanBody, required, validEmail } from "../middleware/validate.js";

const router = Router();
const staffOnly = [authenticate, requireRole("admin", "staff")];

router.post(
  "/",
  cleanBody,
  required(["full_name", "email", "subject", "message"]),
  validEmail(),
  createMessage,
);

router.get("/", ...staffOnly, listMessages);
router.patch("/:id/read", ...staffOnly, markMessageRead);
router.delete("/:id", ...staffOnly, deleteMessage);

export default router;
