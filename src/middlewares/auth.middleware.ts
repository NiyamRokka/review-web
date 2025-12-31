import { NextFunction, Request, Response } from "express"
import CustomError from "./error-handler.middleware";
import { verifyToken } from "../utils/jwt.utils";
import User from "../models/user.models";
import { IJwtPayload } from "../types/global.types";
import { Role } from "../types/enum.types";

export const authenticate = (roles?:Role[]) => {
    return async (req:Request,res:Response,next:NextFunction)=>{

        try{

            const token = req.cookies.access_token;
            console.log(token)
          
            if(!token){
                throw new CustomError('Unauthorized, access denied',401)
            }

            const decodedData:IJwtPayload = verifyToken(token)

            console.log(decodedData)

            //check database if the user exists
            const user = await User.findOne({email:decodedData.email})
            if(!user){
                throw new CustomError('Unauthorized, Access Denied',401)
            }
                 
            //token expiration
            if(Date.now() > decodedData.exp * 1000){
                res.clearCookie('access_token',{
                    maxAge:Date.now(),
                    httpOnly:true,
                    sameSite:"none",
                    secure: process.env.NODE_ENV === "development" ? false : true,
                })
                throw new CustomError('Unauthorized, Access Denied',403)
            }

            //roles
            if(Array.isArray(roles) && !roles?.includes(user.role)){
                throw new CustomError('Forbidden, You cannot access this resource',403)
            }

    req.user = {
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      };
            next()
        }catch(error){
            next(error)
        }



        
    }
}