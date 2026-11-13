import { Router } from "express";
import { createUser, deleteUser, listUsers, updateUser } from "../controllers/usersController.js";
import { authenticate, requireRole } from "../middleware/auth.js";
import { cleanBody, minLength, oneOf, required, validEmail } from "../middleware/validate.js";

const router = Router();

router.use(authenticate, requireRole("admin"));

router.get("/", listUsers);

router.post(
  "/",
  cleanBody,
  required(["full_name", "email", "password"]),
  validEmail(),
  minLength("password", 8),
  oneOf("role", ["admin", "staff", "volunteer"]),
  createUser,
);

router.put(
  "/:id",
  cleanBody,
  validEmail(),
  oneOf("role", ["admin", "staff", "volunteer"]),
  updateUser,
);

router.delete("/:id", deleteUser);

export default router;
