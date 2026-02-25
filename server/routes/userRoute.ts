import { Router } from "express";
import { signup, login, userProfile } from "../controllers/userController.js";
import { requireAuth } from "../middleware.js";

const router = Router();

router.post("/signup", signup)
router.post("/login", login)
router.get("/me", requireAuth, userProfile)

export default router;