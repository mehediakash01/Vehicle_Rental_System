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
    const result = await userServices.createUser(
      name,
      loweredMail,
      hashedPassword,
      phone,
      fixedRole
    );

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
};
// getting all user(only admin)
const getUser = async (req: Request, res: Response) => {
  try {
    const result = await userServices.getUser();
    res
      .status(200)
      .json({
        success: true,
        message: "Users retrieved successfully",
        data: result.rows,
      });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
// update user by admin(can update role and details) or own profile(can update user details)
const updateUser = async (req: Request, res: Response) => {
  const { name, email, phone, role } = req.body;
  const {userId} = req.params;
  // const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const result = await userServices.updateUser(name,email,phone,role,userId)
    if (!result || result.rowCount==0){
      return res.status(404).json({success:false,message:"user not found"});
    }
    res.status(200).json({
      success:true,
      message:"User updated successfully",
      data:result.rows[0]
    })
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const userControllers = { createUser, getUser ,updateUser};
