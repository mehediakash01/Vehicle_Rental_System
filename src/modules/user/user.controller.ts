import { Request, Response } from "express";
import bcrypt from "bcrypt";

import { userServices } from "./user.service";
import { pool } from "../../config/dB";
// create user
const createUser = async (req: Request, res: Response) => {
  const { name, email, password, phone, role } = req.body;
  if (!password || password.length < 6) {
    return res
      .status(400)
      .json({ message: "password must be more than 6 length" });
  }

  const loweredMail = email.toLowerCase();
  const hashedPassword = await bcrypt.hash(password, 10);
  const fixedRole = role === "admin" ? "admin" : "customer";
  try {
    const result = await userServices.createUser(name,loweredMail,hashedPassword,phone,fixedRole);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}
// getting all user(only admin)
const getUser = async(req:Request,res:Response)=>{
  try{
   const result = await pool.query(`SELECT * FROM users`);
   res.status(200).json({success:true,
    message:"Users retrieved successfully",
    data:result.rows
  })

  }
  catch(err:any){
    res.status(500).json({success:false,message:err.message})

  }

}

export const userControllers = {createUser,getUser};