import { pool } from "../../config/dB";

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
export const bookingService = {
    createBooking,
}