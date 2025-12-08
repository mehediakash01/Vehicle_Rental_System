import { Router } from "express";

const router = Router();
router.post("/signup",authController.createUser)

export const authRouter = router;