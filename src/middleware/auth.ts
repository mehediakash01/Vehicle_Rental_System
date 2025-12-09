import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
export const auth = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader?.split(" ")[1];
      if (!token) {
        return res
          .status(401)
          .json({ message: "Missing or invalid authentication token" });
      }

      const decoded = jwt.verify(
        token,
        config.jwt_secret as string
      ) as JwtPayload;
      console.log(decoded);
      req.user = decoded;
      if (roles.length && !roles.includes(decoded.role)) {
        return res
          .status(403)
          .json({ success: false, message: "forbidden:unauthorized access" });
      }
      next();
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  };
};
