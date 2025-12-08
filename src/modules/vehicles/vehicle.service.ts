import { pool } from "../../config/dB";
// creating vehicle
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
// getting all vehicle
const getVehicle = async () => {
  const result = await pool.query(`SELECT * FROM vehicles`);
  return result;
};
// getting single vehicle
const getSingleVehicle = async (vehicleId: string | undefined) => {
  const result = await pool.query(`SELECT * FROM vehicles WHERE id =$1 `, [
    vehicleId,
  ]);
  return result;
};

// updating vehicle

const updatingVehicle = async (
  vehicle_name: string,
  type: string,
  registration_number: string,
  daily_rent_price: number,
  availability_status: string,
  vehicleId: string | undefined
) => {
  const result = await pool.query(
    `UPDATE vehicles SET vehicle_name=$1, type=$2, registration_number=$3 ,daily_rent_price=$4, availability_status=$5 WHERE id=$6 RETURNING *`,
    [
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
      vehicleId,
    ]
  );
  return result;
};
// deleting vehicle
const deleteVehicle = async (vehicleId: string | undefined) => {
  const result = await pool.query(
    `DELETE FROM vehicles WHERE id=$1 RETURNING *`,
    [vehicleId]
  );
  return result;
};
export const vehicleServices = {
  createVehicle,
  getVehicle,
  getSingleVehicle,
  updatingVehicle,
  deleteVehicle,
};
