import { Router } from "express";
import {
  createEvent,
  deleteEvent,
  getEvent,
  listEventRegistrations,
  listEvents,
  registerForEvent,
  updateEvent,
} from "../controllers/eventsController.js";
import { authenticate, requireRole } from "../middleware/auth.js";
import { uploadImage } from "../middleware/upload.js";
import { cleanBody, oneOf, required, validEmail } from "../middleware/validate.js";

const router = Router();
const staffOnly = [authenticate, requireRole("admin", "staff")];

router.get("/", listEvents);
router.get("/:id", getEvent);

router.post(
  "/:id/register",
  cleanBody,
  required(["full_name", "email", "phone"]),
  validEmail(),
  registerForEvent,
);

router.get("/:id/registrations", ...staffOnly, listEventRegistrations);

router.post(
  "/",
  ...staffOnly,
  uploadImage,
  cleanBody,
  required(["title", "description", "event_date"]),
  oneOf("status", ["upcoming", "completed", "cancelled"]),
  createEvent,
);

router.put(
  "/:id",
  ...staffOnly,
  uploadImage,
  cleanBody,
  oneOf("status", ["upcoming", "completed", "cancelled"]),
  updateEvent,
);

router.delete("/:id", ...staffOnly, deleteEvent);

export default router;
