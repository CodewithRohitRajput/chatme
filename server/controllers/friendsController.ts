import type { Request, Response } from "express";
import User from "../models/user.js";
import friendReq from "../models/request.js";

export const allUsers = async (req : Request, res : Response) => {
    const response = await User.find({_id : {$ne : req.user._id}}).select('username _id') 
    const data = await res.json(response);
    return res.status(200).json({data})
}

export const sendRequest = async (req  : Request, res : Response) => {
    const {id} = req.params
    if(!id) return res.status(404).json({message : "User has gone"})
    const response = await friendReq.create(
        {from : req.user._id, to : id }
    )
    const username = await User.findOne({_id : id}).select('username')
    return res.status(201).json({message : `Friend Request is sent to ${username}`})
}

export const incomingRequest = async (req : Request, res : Response) => {
    const userId = req.user._id;
    const reqToMe = await friendReq.find({to : userId, status : 'Pending'}).populate('from', 'username')
    return res.status(201).json(reqToMe)
}


export const acceptORreject = async (req : Request, res : Response) => {
    const {id} = req.params;
    const {status} = req.body;
    const frndReq = await friendReq.findById(id).populate('from','username');
    if(!frndReq) return res.status(404).json({message : "Request not found"});
    const fromUsername = (frndReq.from as any)?.username ?? 'unknown'
    if(status === 'Accepted'){
        await Promise.all([
            User.findByIdAndUpdate(frndReq.from, {$addToSet : {friends : frndReq.to} }),
            User.findByIdAndUpdate(frndReq.to, {$addToSet : {friends : frndReq.from} }),
        ]);
    }
    frndReq.status = status;
    await frndReq.save();
    return res.status(200).json({message : `Request from ${fromUsername} ${status}`})
}