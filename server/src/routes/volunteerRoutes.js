import { Router } from "express";
import {
  createVolunteer,
  deleteVolunteer,
  listVolunteers,
  updateVolunteer,
  updateVolunteerStatus,
} from "../controllers/volunteersController.js";
import { authenticate, requireRole } from "../middleware/auth.js";
import { cleanBody, oneOf, required, validEmail } from "../middleware/validate.js";

const router = Router();
const staffOnly = [authenticate, requireRole("admin", "staff")];

router.post("/", cleanBody, required(["full_name", "email", "phone"]), validEmail(), createVolunteer);

router.get("/", ...staffOnly, listVolunteers);
router.put("/:id", ...staffOnly, cleanBody, validEmail(), updateVolunteer);
router.patch(
  "/:id/status",
  ...staffOnly,
  cleanBody,
  required(["status"]),
  oneOf("status", ["pending", "approved", "rejected"]),
  updateVolunteerStatus,
);
router.delete("/:id", ...staffOnly, deleteVolunteer);

export default router;
