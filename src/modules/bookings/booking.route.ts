import { Router } from "express";
import { bookingController } from "./booking.controller";

const router = Router();
router.post("/",bookingController.createBooking);
router.get("/",bookingController.getBooking);
export const bookingRoutes = router;
