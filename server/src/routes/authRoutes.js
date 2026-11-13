import { Router } from "express";
import { login, profile } from "../controllers/authController.js";
import { authenticate } from "../middleware/auth.js";
import { cleanBody, required, validEmail } from "../middleware/validate.js";

const router = Router();

router.post("/login", cleanBody, required(["email", "password"]), validEmail(), login);

router.get("/profile", authenticate, profile);

export default router;
