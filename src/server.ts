import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import cors from 'cors'
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { connectDatabase } from "./config/database.config";
import CustomError, {
  errorHandler,
} from "./middlewares/error-handler.middleware";

// importing routes
import authRoutes from './routes/auth.routes'
import userRoutes from './routes/user.routes'
import reviewRoutes from "./routes/review.routes"
import itemRoutes from "./routes/item.routes"


const PORT = process.env.PORT || 5000;
const DB_URI = process.env.DB_URI ?? "";

const app = express();

// using middlewares
// cors
const allowed_origins = [
  "https://review-web-q39m.onrender.com",
  "http://localhost:8848",
  process.env.FRONT_END_URL,
];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) callback(null, true);

      if (!allowed_origins.includes(origin)) {
        callback(new CustomError("Cors error. Origin not accepted", 400));
      } else {
        callback(null, true);
      }
    },
    credentials: true,
  })
);
app.use(helmet())
app.use(express.urlencoded({ extended: true, limit: "5mb" }));
app.use(express.json({ limit: "5mb" }));
app.use(cookieParser());
// headers
// ...

// serving static files
app.use("/api/uploads", express.static("uploads/"));

// connect database
connectDatabase(DB_URI);

// ping route
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Server is up & running",
  });
});

// using routes
app.use('/api/auth',authRoutes)
app.use('/api/user',userRoutes)
app.use("/api/reviews",reviewRoutes)
app.use("/api/item",itemRoutes)

// fallback route
app.all("/{*all}", (req: Request, res: Response, next: NextFunction) => {
  const error = new CustomError(
    `Can not ${req.method} on ${req.originalUrl}`,
    404
  );
  next(error);
});

app.listen(PORT, () => {
  console.log(`server running at http://localhost:${PORT}`);
});

// using error handler

app.use(errorHandler);
// error handler middleware
// use in server.ts
// customError handler class  and use