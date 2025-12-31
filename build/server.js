"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const database_config_1 = require("./config/database.config");
const error_handler_middleware_1 = __importStar(require("./middlewares/error-handler.middleware"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
// importing routes
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const review_routes_1 = __importDefault(require("./routes/review.routes"));
const item_routes_1 = __importDefault(require("./routes/item.routes"));
const PORT = process.env.PORT || 5000;
const DB_URI = (_a = process.env.DB_URI) !== null && _a !== void 0 ? _a : '';
const app = (0, express_1.default)();
// using middlewares
app.use(express_1.default.urlencoded({ extended: true, limit: '5mb' }));
app.use(express_1.default.json({ limit: '5mb' }));
app.use((0, cookie_parser_1.default)());
// cors
// headers
// ...
// connect database
(0, database_config_1.connectDatabase)(DB_URI);
// ping route
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Server is up & running'
    });
});
// using routes
app.use('/api/auth', auth_routes_1.default);
app.use('/api/user', user_routes_1.default);
app.use("/api/reviews", review_routes_1.default);
app.use("/api/item", item_routes_1.default);
// serving static files
app.use('/api/uploads', express_1.default.static('uploads/'));
// fallback route
app.all('/{*all}', (req, res, next) => {
    const error = new error_handler_middleware_1.default(`Can not ${req.method} on ${req.originalUrl}`, 404);
    next(error);
});
app.listen(PORT, () => {
    console.log(`server running at http://localhost:${PORT}`);
});
// using error handler
app.use(error_handler_middleware_1.errorHandler);
// error handler middleware
// use in server.ts
// customError handler class and use
