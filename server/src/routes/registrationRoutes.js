import { Router } from "express";
import {
  deleteRegistration,
  listRegistrations,
  updateRegistration,
} from "../controllers/eventsController.js";
import { authenticate, requireRole } from "../middleware/auth.js";
import { cleanBody, oneOf } from "../middleware/validate.js";

const router = Router();

router.use(authenticate, requireRole("admin", "staff"));

router.get("/", listRegistrations);
router.put("/:id", cleanBody, oneOf("status", ["registered", "cancelled", "attended"]), updateRegistration);
router.delete("/:id", deleteRegistration);

export default router;
