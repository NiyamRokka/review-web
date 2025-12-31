import mongoose from "mongoose";
import { Role } from "./enum.types";

export const OnlyUser = [Role.USER]
export const OnlySuperAdmin = [Role.SUPER_ADMIN]
export const OnlyAdmin = [Role.ADMIN]
export const AllAdmins = [Role.SUPER_ADMIN,Role.ADMIN]
export const AllUserAndAdmins=  [Role.SUPER_ADMIN,Role.ADMIN,Role.USER]





export interface IPayload {
    _id:mongoose.Types.ObjectId;
    email:string;
    firstName:string;
    lastName:string;
    role:Role
}

export interface IJwtPayload extends IPayload {
    iat:number;
    exp:number;
}