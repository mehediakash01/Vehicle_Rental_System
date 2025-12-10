import { pool } from "../../config/dB";
import bcrypt from "bcrypt"

import jwt from "jsonwebtoken"
import config from "../../config";
// create user
const createUser = async(name:string,loweredMail:string,hashedPassword:string,phone:string,fixedRole:string)=>{
     const result = await pool.query(
          `INSERT INTO users(name,email,password,phone,role) VALUES($1,$2,$3,$4,$5) RETURNING * `,
          [name, loweredMail, hashedPassword, phone, fixedRole]
        );
        return result;
}
// login user
const loginUser = async (email:string,password:string)=>{
  const result = await pool.query(`SELECT * FROM users WHERE email=$1`,[email])
  if (result.rows.length===0){
    return null;
  }

  const user = result.rows[0];
  const decodedPass = await bcrypt.compare(password,user.password);
  if (!decodedPass){
    return false;
  }
  
  const token = jwt.sign({name:user.name,email:user.email,id:user.id,role:user.role},config.jwt_secret as string,{ expiresIn:"7d"})
  console.log(token);

  return {token,user};
}

export const authService = {
    createUser,
    loginUser
}