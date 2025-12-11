import { Router } from "express";
import { bookingController } from "./booking.controller";
import logger from "../../middleware/logger";
import { auth } from "../../middleware/auth";

const router = Router();
router.post("/",logger,auth("admin","customer"),bookingController.createBooking);
router.get("/",logger,auth("admin","customer"),bookingController.getBooking);
router.put("/:bookingId",bookingController.updateBooking);
export const bookingRoutes = router;
