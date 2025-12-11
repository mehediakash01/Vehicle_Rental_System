import { Request, Response } from "express";
import { pool } from "../../config/dB";
import { bookingService } from "./booking.service";
// creating bookings
const createBooking = async (req: Request, res: Response) => {
  try {
    const { customer_id, vehicle_id, rent_start_date, rent_end_date } =
      req.body;
 
    const status = "active";
    const startDate = new Date(rent_start_date);
    const endDate = new Date(rent_end_date);
    if (endDate <= startDate) {
      return res.status(400).json({
        success: false,
        message: "rent_end_date must be after rent_start_date",
      });

    }
    // check if customer exists
      const customerCheck = await pool.query(
      "SELECT id FROM users WHERE id = $1",
      [customer_id]
    );

    if (customerCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }
    
    //   getting single vehicle
    const vehicleResult = await pool.query(
      "SELECT vehicle_name, daily_rent_price,availability_status FROM vehicles WHERE id=$1",
      [vehicle_id]
    );
    // check if vehicle exists
       if (vehicleResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }
      const vehicle = vehicleResult.rows[0];
    const { daily_rent_price, vehicle_name,availability_status } = vehicle;

    // check if vehicle already booked
     if (availability_status === "booked") {
      return res.status(400).json({
        success: false,
        message: "Vehicle is already booked",
      });
    }

    // update vehicle status
    await pool.query(
      `UPDATE vehicles SET availability_status = 'booked', updatedAt = NOW() WHERE id = $1`,
      [vehicle_id]
    );

 

  

    const msInDay = 1000 * 60 * 60 * 24;
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / msInDay);
    const total_price = days * daily_rent_price;

    const result = await bookingService.createBooking(customer_id,
        vehicle_id,
        rent_start_date,
        rent_end_date,
        total_price,
        status)
    res.status(201).json({
      success: true,
      message: "Vehicle created successfully",
      data: {
        ...result.rows[0],
        vehicle: { vehicle_name, daily_rent_price },
      },
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
// getting all booking by admin and own booking by customer
const getBooking = async(req:Request,res:Response)=>{
  try {
      const result = await bookingService.getBooking();
      res
        .status(200)
        .json({
          success: true,
          message: "Bookings retrieved successfully",
          data: result.rows,
        });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
}
const updateBooking = async (req: Request, res: Response) => {
  const { status } = req.body;
  const {bookingId} = req.params;

  try {
    const result = await bookingService.updateBooking(status,bookingId)
    if (!result || result.rowCount==0){
      return res.status(404).json({success:false,message:"booking not found"});
    }
    
    res.status(200).json({
      success:true,
      message:status==="cancel"? "Booking cancelled successfully": status ==="returned"? "Booking marked as returned. Vehicle is now available" :"active",

      data:result.rows[0]
    })
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
export const bookingController = {
  createBooking,
  getBooking,
  updateBooking
};
