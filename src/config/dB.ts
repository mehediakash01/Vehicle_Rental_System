import { Pool } from "pg";
import config from ".";
// Db
export const pool = new Pool({
  connectionString: `${config.connection_str}`,
});

const initDB = async () => {
  await pool.query(`
        
        CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL ,
        email VARCHAR(100) UNIQUE NOT NULL ,
        password VARCHAR(255) NOT NULL ,
        phone VARCHAR(15) NOT NULL ,
        role VARCHAR(50) NOT NULL,
        createdAt TIMESTAMP DEFAULT NOW(),
        updatedAt TIMESTAMP DEFAULT NOW()
        
        )
        `);
  await pool.query(`
        
        CREATE TABLE IF NOT EXISTS vehicles(
        id SERIAL PRIMARY KEY,
        vehicle_name VARCHAR(100) NOT NULL ,
        type VARCHAR(50) ,
        registration_number VARCHAR(100) UNIQUE NOT NULL ,
        daily_rent_price INT NOT NULL ,
       availability_status VARCHAR(50),
        createdAt TIMESTAMP DEFAULT NOW(),
        updatedAt TIMESTAMP DEFAULT NOW()
        
        )
        `);
  await pool.query(`
        
        CREATE TABLE IF NOT EXISTS bookings(
        id SERIAL PRIMARY KEY,
        customer_id INT REFERENCES users(id) ON DELETE CASCADE ,
        vehicle_id INT REFERENCES vehicles(id) ON DELETE CASCADE ,
    
        rent_start_date TIMESTAMP  NOT NULL,

        rent_end_date TIMESTAMP NOT NULL,
        total_price INT NOT NULL ,
        status VARCHAR(50) NOT NULL,
        createdAt TIMESTAMP DEFAULT NOW(),
        updatedAt TIMESTAMP DEFAULT NOW()
        
        
        )
        `);
};
export default initDB;
