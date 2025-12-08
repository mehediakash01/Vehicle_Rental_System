import { Router } from "express";
import { userControllers } from "./user.controller";

const router = Router();
router.post("/",userControllers.createUser );
router.get("/",userControllers.getUser)

export const userRoutes = router;

