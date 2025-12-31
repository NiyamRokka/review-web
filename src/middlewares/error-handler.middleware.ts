import { NextFunction, Request, Response } from "express";


class CustomError extends Error {
    statusCode:number;
    status:'success'|'fail' | 'error'
    isOperational:boolean
    success:boolean

    constructor(message:string,statusCode:number){
        super(message)
        // Error(message)
        this.isOperational = true;
        this.statusCode = statusCode;
        this.success = false
        this.status = statusCode >= 400 && statusCode < 500 ? 'fail' : 'error';
        Error.captureStackTrace(this,CustomError)
    }

}


export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = error?.statusCode || 500;

  const message = error?.message || "Internal Server Error";
  const success = error?.success || false;
  const status = error?.status || "error";

  res.status(statusCode).json({
    message,
    success,
    status,
    data: null,
  });
};


export default CustomError