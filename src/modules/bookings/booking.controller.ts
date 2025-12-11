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

const getBooking = async (req: Request, res: Response) => {
  const requestingUser = req.user;
  const isAdmin = requestingUser?.role === "admin";
  const customerId = requestingUser?.id;


  try {
    let result;

    let formattedData= [];
    // Admin gets ALL bookings with customer and vehicle info
    if (isAdmin) {
      result = await bookingService.getAllBookings();
      
      // Format for admin view
      formattedData = result.rows.map((booking) => ({
        id: booking.id,
        customer_id: booking.customer_id,
        vehicle_id: booking.vehicle_id,
        rent_start_date: booking.rent_start_date,
        rent_end_date: booking.rent_end_date,
        total_price: booking.total_price,
        status: booking.status,
        customer: {
          name: booking.customer_name,
          email: booking.customer_email,
        },
        vehicle: {
          vehicle_name: booking.vehicle_name,
          registration_number: booking.registration_number,
        },
      }));

      return res.status(200).json({
        success: true,
        message: "Bookings retrieved successfully",
        data: formattedData,
      });
    } 
    // Customer gets ONLY their bookings with vehicle info
    else {
      result = await bookingService.getBookingsByCustomer(customerId);
      
      // Format for customer view
      formattedData = result.rows.map((booking) => ({
        id: booking.id,
        vehicle_id: booking.vehicle_id,
        rent_start_date: booking.rent_start_date,
        rent_end_date: booking.rent_end_date,
        total_price: booking.total_price,
        status: booking.status,
        vehicle: {
          vehicle_name: booking.vehicle_name,
          registration_number: booking.registration_number,
          type: booking.type,
        },
      }));

      return res.status(200).json({
        success: true,
        message: "Your bookings retrieved successfully",
        data: formattedData,
      });
    }

  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
const updateBooking = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const { bookingId } = req.params;

    const requestingUser = req.user;
    const isAdmin = requestingUser?.role === "admin";
    const userId = requestingUser?.id;

    //  Fetch the booking
    const bookingResult = await pool.query(
      `SELECT * FROM bookings WHERE id=$1`,
      [bookingId]
    );

    if (bookingResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    const booking = bookingResult.rows[0];

    //  Role-based permission checks
    if (!isAdmin) {
      
      if (booking.customer_id !== userId) {
        return res.status(403).json({
          success: false,
          message: "You cannot modify someone else's booking",
        });
      }

      if (status !== "cancelled") {
        return res.status(403).json({
          success: false,
          message: "Customers can only cancel their bookings",
        });
      }
    }

    // ADMIN RULE
    if (isAdmin && !["cancelled", "returned"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Admin can only set status to cancelled or returned",
      });
    }

    //  Update booking
    const updatedBooking = await bookingService.updateBooking(status, bookingId);

    //  If returned or cancelled → update vehicle availability
    if (status === "cancelled" || status === "returned") {
      await bookingService.updateVehicleStatus(
        booking.vehicle_id,
        "available"
      );
    }

    //  Success response
    return res.status(200).json({
      success: true,
      message:
        status === "cancelled"
          ? "Booking cancelled successfully"
          : "Booking marked as returned. Vehicle is now available",
      data: updatedBooking.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const bookingController = {
  createBooking,
  getBooking,
  updateBooking
};
