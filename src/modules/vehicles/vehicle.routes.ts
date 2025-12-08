import { Request, Response, Router } from "express";
import { vehicleControllers } from "./vehicle.controller";

const router = Router();
// posting vehicle 
router.post("/",vehicleControllers.createVehicle)
// getting all vehicle
router.get("/",vehicleControllers.getVehicle)
// getting single vehicle
router.get("/:vehicleId",vehicleControllers.getSingleVehicle)
// updating vehicle
router.put("/:vehicleId",vehicleControllers.updatingVehicle)
// deleting vehicle
router.delete("/:vehicleId",vehicleControllers.deleteVehicle)

export const vehicleRouter = router;