import 'dotenv/config'
import express, { NextFunction, Request, Response } from 'express'
import { connectDatabase } from './config/database.config'
import CustomError, { errorHandler } from './middlewares/error-handler.middleware'
import cookieParser from 'cookie-parser'


// importing routes
import authRoutes from './routes/auth.routes'
import userRoutes from './routes/user.routes'
import reviewRoutes from "./routes/review.routes"
import itemRoutes from "./routes/item.routes"

const PORT = process.env.PORT || 5000
const DB_URI =  process.env.DB_URI ?? ''


const app = express()


// using middlewares
app.use(express.urlencoded({extended:true,limit:'5mb'}))
app.use(express.json({limit:'5mb'}))
app.use(cookieParser())
// cors
// headers
// ...


// connect database
connectDatabase(DB_URI)



// ping route
app.get('/',(req,res)=>{
    
    res.status(200).json({
        message:'Server is up & running'
    })
})

// using routes
app.use('/api/auth',authRoutes)
app.use('/api/user',userRoutes)
app.use("/api/reviews",reviewRoutes)
app.use("/api/item",itemRoutes)

// serving static files
app.use('/api/uploads',express.static('uploads/'))


// fallback route
app.all('/{*all}',(req:Request,res:Response,next:NextFunction) =>{
     const error = new CustomError(`Can not ${req.method} on ${req.originalUrl}`,404)
     next(error)
})


app.listen(PORT,()=>{
    console.log(`server running at http://localhost:${PORT}`)
})


// using error handler

app.use(errorHandler)
// error handler middleware
// use in server.ts
// customError handler class and use