import {  Router } from "express";
import { vehicleControllers } from "./vehicle.controller";
import logger from "../../middleware/logger";
import { auth } from "../../middleware/auth";

const router = Router();
// posting vehicle 
router.post("/",logger,auth("admin"), vehicleControllers.createVehicle)
// getting all vehicle
router.get("/",vehicleControllers.getVehicle)
// getting single vehicle
router.get("/:vehicleId",vehicleControllers.getSingleVehicle)
// updating vehicle
router.put("/:vehicleId",logger,auth("admin"), vehicleControllers.updatingVehicle)
// deleting vehicle
router.delete("/:vehicleId",vehicleControllers.deleteVehicle)

export const vehicleRouter = router;