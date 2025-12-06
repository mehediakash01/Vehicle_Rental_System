import { Request, Response, Router } from "express";
import { pool } from "../../config/dB";
import bcrypt from "bcrypt";
const router = Router();
router.post("/", async (req: Request, res: Response) => {
  const { name, email, password, phone, role } = req.body;
  if (!password || password.length < 6) {
    return res.status(400).json({ message: "password must be more than 6 length" });
  }

  const loweredMail = email.toLowerCase();
  const hashedPassword = await bcrypt.hash(password, 10);
  const fixedRole = role === "admin" ? "admin" : "customer";
  try {
    const result = await pool.query(
      `INSERT INTO users(name,email,password,phone,role) VALUES($1,$2,$3,$4,$5) RETURNING * `,
      [name, loweredMail, hashedPassword, phone, fixedRole]
    );
    
    res.send({ message: "Data inserted successfully" });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

export const userRoutes = router;
