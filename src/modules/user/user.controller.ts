import { Request, Response } from "express";


import { userServices } from "./user.service";
import { pool } from "../../config/dB";

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
  const requestingUser = req.user;

  try {

    const isAdmin = requestingUser?.role==="admin";
    const isOwnProfile = requestingUser?.id===userId;
    if (!isAdmin && !isOwnProfile) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own profile"
      });
    }
    let result;
    if (isAdmin){
result = await userServices.updateUser(name,email,phone,role,userId)
    }
    else{
      result = await userServices.updateUser(name,email,phone,userId)

    }
     
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

// Delete user by only admin and delete only if no bookings is active by the user
const deleteUser = async (req: Request, res: Response) => {

  const {userId} = req.params;
  const user = await pool.query(`SELECT `)

  try {
    const result = await userServices.deleteUser(userId)
    if (!result || result.rowCount===0){
      return res.status(404).json({success:false,message:"user not found"});
    }
   else{
    res.status(200).json({
      success:true,
      message:"User Deleted successfully",
      data:null
    })

   } 
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const userControllers = {  getUser ,updateUser,deleteUser};
