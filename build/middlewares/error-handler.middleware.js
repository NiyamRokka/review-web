"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
class CustomError extends Error {
    constructor(message, statusCode) {
        super(message);
        // Error(message)
        this.isOperational = true;
        this.statusCode = statusCode;
        this.success = false;
        this.status = statusCode >= 400 && statusCode < 500 ? 'fail' : 'error';
        Error.captureStackTrace(this, CustomError);
    }
}
const errorHandler = (error, req, res, next) => {
    const statusCode = (error === null || error === void 0 ? void 0 : error.statusCode) || 500;
    const message = (error === null || error === void 0 ? void 0 : error.message) || "Internal Server Error";
    const success = (error === null || error === void 0 ? void 0 : error.success) || false;
    const status = (error === null || error === void 0 ? void 0 : error.status) || "error";
    res.status(statusCode).json({
        message,
        success,
        status,
        data: null,
    });
};
exports.errorHandler = errorHandler;
exports.default = CustomError;
