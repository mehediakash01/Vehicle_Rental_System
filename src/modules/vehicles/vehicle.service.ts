import { pool } from "../../config/dB";

const createVehicle = async (
  vehicle_name: string,
  vehicleType: string | null,
  registration_number: string,
  daily_rent_price: number,
  availability: string
) => {
  const result = await pool.query(
    `INSERT INTO vehicles(vehicle_name,type,registration_number,daily_rent_price,availability_status) VALUES($1,$2,$3,$4,$5) RETURNING*`,
    [
      vehicle_name,
      vehicleType,
      registration_number,
      daily_rent_price,
      availability,
    ]
  );
  return result;
};
export const vehicleServices = {
  createVehicle,
};
