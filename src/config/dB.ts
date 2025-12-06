
import{ Pool} from "pg";
import config from ".";
// Db
export const pool = new Pool({
connectionString :`${config.connection_str}`
})

const initDB  = async()=>{
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
        `)

}
export default initDB;