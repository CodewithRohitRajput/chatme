import User from '../models/user.js'
import express from 'express'
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'
dotenv.config()

const router = express.Router()

router.post("/signup", async (req, res) => {
    const {username, email, password} = req.body;

    const alreadyUsername = await User.findOne({username});
    if(alreadyUsername) return res.status(409).json({message : "username already exists"})
    const alreadyEmail = await User.findOne({email});
    if(alreadyEmail) return res.status(409).json({message : "email already exists"})
    const hashedPass = await bcrypt.hash(password,10)
    const newUser = await User.create({username, email, password : hashedPass})
    return res.status(201).json({message : "user created successfully"})
})


router.post("/login", async (req, res) => {

    const {email, password} = req.body;
    const isUser = await User.findOne({email}) as { password: string } | null;
    if(!isUser) return res.status(404).json({message : "user not found"})
    const chkPass = await bcrypt.compare(password, isUser.password)
    if(!chkPass) return res.status(401).json({message : "password is wrong"})
    return res.status(200).json({message : "user loggedIn"})

})

export default router;