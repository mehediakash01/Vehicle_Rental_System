import { pool } from "../../config/dB";

const createUser = async(name:string,loweredMail:string,hashedPassword:string,phone:string,fixedRole:string)=>{
     const result = await pool.query(
          `INSERT INTO users(name,email,password,phone,role) VALUES($1,$2,$3,$4,$5) RETURNING * `,
          [name, loweredMail, hashedPassword, phone, fixedRole]
        );
        return result;
}
export const userServices = {
    createUser
}