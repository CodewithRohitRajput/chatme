import User from '../models/user.js'
import type { Request, Response } from 'express'
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
dotenv.config()

const access_token_secret = process.env.ACCESS_TOKEN_SECRET
if(!access_token_secret) throw new Error('SECRET is not present')


export const signup = async (req: Request, res: Response) => {
    const {username, email, password} = req.body;

    const alreadyUsername = await User.findOne({username});
    if(alreadyUsername) return res.status(409).json({message : "username already exists"})
    const alreadyEmail = await User.findOne({email});
    if(alreadyEmail) return res.status(409).json({message : "email already exists"})
    const hashedPass = await bcrypt.hash(password,10)
    const newUser = await User.create({username, email, password : hashedPass})
    const token = await jwt.sign(
        {userId : newUser._id},
        access_token_secret,
        {expiresIn : "1d"}
    );
    res.cookie("token", token, {
        httpOnly : true,
        secure : false,
        sameSite : "lax",

    })
    return res.status(201).json({message : "user created successfully"})
}


export const login = async (req: Request, res: Response) => {

    const {email, password} = req.body;
    const isUser = await User.findOne({email}) as { password: string } | null;
    if(!isUser) return res.status(404).json({message : "user not found"})
    const chkPass = await bcrypt.compare(password, isUser.password)
    if(!chkPass) return res.status(401).json({message : "password is wrong"})
    return res.status(200).json({message : "user loggedIn"})

}
