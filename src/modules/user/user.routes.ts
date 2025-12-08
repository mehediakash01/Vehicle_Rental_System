import { Router } from "express";
import { userControllers } from "./user.controller";

const router = Router();
router.post("/",userControllers.createUser );
router.get("/",userControllers.getUser)
router.put("/:userId",userControllers.updateUser)
router.put("/:userId",userControllers.updateUser)

export const userRoutes = router;

