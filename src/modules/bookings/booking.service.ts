import { pool } from "../../config/dB";
// create booking logic
const createBooking = async(customer_id:number,
        vehicle_id:number,
        rent_start_date:string,
        rent_end_date:string,
        total_price:number,
        status:string,)=>{
    const result = await pool.query(
      `INSERT INTO bookings(customer_id, vehicle_id, rent_start_date, rent_end_date,total_price,status ) VALUES($1,$2,$3,$4,$5,$6) RETURNING *`,
      [
        customer_id,
        vehicle_id,
        rent_start_date,
        rent_end_date,
        total_price,
        status,
      ]
    );
    return result;

}
// getting all booking logic
const getAllBookings = async () => {
  const result = await pool.query(
    `SELECT 
      b.id, 
      b.customer_id, 
      b.vehicle_id, 
      b.rent_start_date, 
      b.rent_end_date, 
      b.total_price, 
      b.status, 
      b.createdat, 
      b.updatedat,
      u.name AS customer_name,
      u.email AS customer_email,
      v.vehicle_name,
      v.registration_number
    FROM bookings b
    JOIN users u ON b.customer_id = u.id
    JOIN vehicles v ON b.vehicle_id = v.id
    ORDER BY b.createdat DESC`
  );
  return result;
};
// get booking by customer
const getBookingsByCustomer = async (customerId: number|undefined) => {
  const result = await pool.query(
    `SELECT 
      b.id, 
      b.vehicle_id, 
      b.rent_start_date, 
      b.rent_end_date, 
      b.total_price, 
      b.status,
      v.vehicle_name,
      v.registration_number,
      v.type
    FROM bookings b
    JOIN vehicles v ON b.vehicle_id = v.id
    WHERE b.customer_id = $1
    ORDER BY b.createdat DESC`,
    [customerId]
  );
  return result;
};
// handling autoReturn logic on expired date
const autoReturnExpiredBookings = async () => {
  // Update expired bookings
  await pool.query(`
    UPDATE bookings
    SET status = 'returned', updatedAt = NOW()
    WHERE rent_end_date < NOW()
    AND status != 'returned';
  `);

  // Updating vehicle availability based on returned bookings
  await pool.query(`
    UPDATE vehicles
    SET availability_status = 'available', updatedAt = NOW()
    WHERE id IN (
      SELECT vehicle_id 
      FROM bookings 
      WHERE rent_end_date < NOW()
      AND status = 'returned'
    );
  `);
};

// update booking
const updateBooking = async (status: string, bookingId: string|undefined) => {
  const result = await pool.query(
    `UPDATE bookings 
     SET status=$1, updatedat=NOW() 
     WHERE id=$2 
     RETURNING *`,
    [status, bookingId]
  );

  return result;
};

const updateVehicleStatus = async (vehicleId: number, newStatus: string) => {
  await pool.query(
    `UPDATE vehicles SET availability_status=$1, updatedat=NOW() WHERE id=$2`,
    [newStatus, vehicleId]
  );
};




export const bookingService = {
    createBooking,
  getAllBookings,
  getBookingsByCustomer,
  autoReturnExpiredBookings,
   updateBooking,
   updateVehicleStatus
}