import { Request, Response, Router } from "express";
import { vehicleControllers } from "./vehicle.controller";

const router = Router();
// posting vehicle 
router.post("/",vehicleControllers.createVehicle)
// getting all vehicle
router.get("/",vehicleControllers.gettingVehicle)

export const vehicleRouter = router;