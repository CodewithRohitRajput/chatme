import express from 'express'
import cors from 'cors'
import type { Request, Response } from 'express';
import ConnectDB from './config/db.js';
import cookieParser from 'cookie-parser'
import userRouter from './routes/userRoute.js';
import friendsRouter from './routes/friendsRoute.js';
const app = express()
const port = 8000;


app.use(cors())
app.use(express.json())
app.use(cookieParser())

ConnectDB()

app.use("/users", userRouter)
app.use("/friends", friendsRouter)

app.listen(port, ()=>{
    console.log(`server is running port ${port}`)
})
