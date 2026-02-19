import express from 'express'
import cors from 'cors'
import type { Request, Response } from 'express';
import ConnectDB from './config/db.js';
const app = express()
const port = 8000;


app.use(cors())
app.use(express.json())

ConnectDB()

app.get("/", (req : Request , res : Response)=>{
    res.send("hey backend in working dude !!!")
})

app.listen(port, ()=>{
    console.log(`server is running port ${port}`)
})
