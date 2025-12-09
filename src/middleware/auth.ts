import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"
import config from "../config";
export const auth = ()=>{
    return (req:Request,res:Response,next:NextFunction)=>{
        const authHeader = req.headers.authorization;
        const token = authHeader?.split(" ")[1];
        if (!token){
            return res.status(401).json({message:"Missing or invalid authentication token"})
        }

      
        const decoded = jwt.verify(token,config.jwt_secret as string);
        console.log(decoded);
    }

}

