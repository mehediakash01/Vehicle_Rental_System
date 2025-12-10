import { Request, Response } from "express";

import { vehicleServices } from "./vehicle.service";
import { pool } from "../../config/dB";
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
    const result = await vehicleServices.updatingVehicle(vehicle_name,type,registration_number,daily_rent_price,availability_status,vehicleId)
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
// deleting booking only by admin and only when vehicle is not active
const deleteVehicle = async (req: Request, res: Response) => {
  const { vehicleId } = req.params;

  try {

    const booking = await pool.query(
      `SELECT * FROM bookings WHERE vehicle_Id=$1`, 
      [vehicleId]
    );

    
    if (booking.rows.length > 0) {
   
      const hasActiveBooking = booking.rows.some(row => row.status === "active");
      
      if (hasActiveBooking) {
        const activeBooking = booking.rows.find(row => row.status === "active");
        return res.status(400).json({
          success: false,
          message: "Can't delete, has active bookings",
          activeBooking: {
            id: activeBooking.id,
            status: activeBooking.status
          }
        });
      }
    }

    
    const result = await vehicleServices.deleteVehicle(vehicleId);
    
    if (!result || result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Vehicle deleted successfully",
      data: null
    });

  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
export const vehicleControllers = {
  createVehicle,
  getVehicle,
  getSingleVehicle,
  updatingVehicle,
  deleteVehicle
};
