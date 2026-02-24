import express from 'express'
import cors from 'cors'
import type { Request, Response } from 'express';
import ConnectDB from './config/db.js';
import cookieParser from 'cookie-parser'
import userRouter from './routes/userRoute.js';
import friendsRouter from './routes/friendsRoute.js';
import setupSocket from  './socket.js'
import http from 'http'
const app = express()
const port = 8000;

const server = http.createServer(app)
setupSocket(server)

app.use(cors({ origin: ['http://localhost:3000'], methods : ['POST', 'GET', 'PATCH', 'PUT', 'DELETE'], credentials : true }))
app.use(express.json())
app.use(cookieParser())

ConnectDB()

app.use("/users", userRouter)
app.use("/friends", friendsRouter)

server.listen(port, ()=>{
    console.log(`server is running port ${port}`)
})
