import { IPayload } from "./global.types";
// import { Types } from "mongoose";

declare global{
    namespace Express {
        interface Request {
            user:IPayload
        }
    }
}


