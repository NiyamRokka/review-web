import * as jwt from "jsonwebtoken";
import { IJwtPayload, IPayload } from "../types/global.types";

const JWT_SECRET = process.env.JWT_SECRET || 'abc.defg.hijk.lmno.pqrst.uvw.xyz'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN

export const generateToken = (payload: IPayload) => {
  return jwt.sign(payload,JWT_SECRET , {
    expiresIn: JWT_EXPIRES_IN as any,
  });
};

export const verifyToken = (token:string) =>{
  return jwt.verify(token,JWT_SECRET) as IJwtPayload
}