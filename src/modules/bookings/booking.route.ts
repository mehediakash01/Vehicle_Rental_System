import { Router } from "express";
import { bookingController } from "./booking.controller";

const router = Router();
router.post("/",bookingController.createBooking);
router.get("/",bookingController.getBooking);
router.put("/:bookingId",bookingController.updateBooking);
export const bookingRoutes = router;
