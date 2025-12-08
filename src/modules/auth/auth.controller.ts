import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { authService } from "./auth.service";
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
    const result = await authService.createUser(
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
// login user

const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }
    const result = await authService.loginUser(email, password);
    if (!result) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }
    res
      .status(200)
      .json({ success: true, message: "login successful", data: result });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
export const authController = { createUser, loginUser };
