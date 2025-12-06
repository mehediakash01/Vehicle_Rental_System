


import express, { Request, Response } from "express";
import{ Pool} from "pg";
import config from "./config";

const app = express()
const port = config.port
app.use(express.json())
// Db
const pool = new Pool({
connectionString :`${config.connection_str}`
})

const initDB  = async()=>{
    await pool.query(`
        
        CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL ,
        email VARCHAR(100) UNIQUE NOT NULL ,
        password NOT NULL ,
        phone INT ,
        role VARCHAR(50) NOT NULL,
        createdAt TIMESTAMP DEFAULT NOW(),
        updatedAt TIMESTAMP DEFAULT NOW()
        
        )
        `)

}
initDB();

app.get('/', (req:Request, res:Response) => {
  res.send('Ronaldo is the Goat!')
})

app.listen(port, () => {
  console.log(`vehicle Running on port ${port}`)
})
