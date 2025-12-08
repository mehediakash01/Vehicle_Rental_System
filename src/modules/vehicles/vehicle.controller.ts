import { Request, Response } from "express";

import { vehicleServices } from "./vehicle.service";
// posting vehicle
const createVehicle = async (req: Request, res: Response) => {
  try {
    const {
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
    } = req.body;
    if (daily_rent_price < 0) {
      return res
        .status(400)
        .json({
          success: false,
          message: "daily rental price must be positive",
        });
    }

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
    const result = await vehicleServices.createVehicle(
      vehicle_name,
      vehicleType,
      registration_number,
      daily_rent_price,
      availability
    );

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
// getting all vehicle
const getVehicle = async (req: Request, res: Response) => {
  try {
    const result = await vehicleServices.getVehicle();
    res
      .status(200)
      .json({
        success: true,
        message: "vehicle retrieved successfully",
        data: result.rows,
      });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
// getting single vehicle
const getSingleVehicle = async (req: Request, res: Response) => {
  const {vehicleId} = req.params;
  try {
    const result = await vehicleServices.getSingleVehicle(vehicleId);
    res
      .status(200)
      .json({
        success: true,
        message: "vehicle retrieved successfully",
        data: result.rows,
      });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// updating vehicle

const updatingVehicle = async (req: Request, res: Response) => {
  const { vehicle_name,type,registration_number,daily_rent_price,availability_status } = req.body;
  const {vehicleId} = req.params;
 
  try {
    const result = await vehicleServices.updateVehicle(vehicle_name,type,registration_number,daily_rent_price,availability_status,vehicleId)
    if (!result || result.rowCount==0){
      return res.status(404).json({success:false,message:"vehicle not found"});
    }
    res.status(200).json({
      success:true,
      message:"vehicle updated successfully",
      data:result.rows[0]
    })
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
export const vehicleControllers = {
  createVehicle,
  getVehicle,
  getSingleVehicle,
  updatingVehicle
};
