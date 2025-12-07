import { Request, Response } from "express";
import { pool } from "../../config/dB";
import { vehicleServices } from "./vehicle.service";

const createVehicle = async (req: Request, res: Response) => {
  try {
    const {
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
    } = req.body;
   
    const vehicleType =
      type === "car"
        ? "car"
        : type === "bike"
        ? "bike"
        : type === "van"
        ? "van"
        : type === "SUV"
        ? "SUV"
        : null;
    const availability =
      availability_status === "available" ? "available" : "booked";
    const result = await vehicleServices.createVehicle( vehicle_name,
        vehicleType,
        registration_number,
        daily_rent_price,
        availability,)

    res.status(201).json({
      success: true,

      message: "Vehicle created successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      
      success: false,
      message: err.message,
    });
  }
};
export const vehicleControllers = {
  createVehicle,
};
