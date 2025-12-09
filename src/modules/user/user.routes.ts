import { Router } from "express";
import { userControllers } from "./user.controller";
import logger from "../../middleware/logger";
import { auth } from "../../middleware/auth";

const router = Router();

router.get("/",logger,auth(), userControllers.getUser)
router.put("/:userId",userControllers.updateUser)
router.delete("/:userId",userControllers.deleteUser)

export const userRoutes = router;

