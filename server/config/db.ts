import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config()
const mongodb_uri = process.env.MONGO_URI
if(!mongodb_uri) throw new Error('mongodb URI is required')
const ConnectDB = async () => {
    try{
        const connected = await mongoose.connect(mongodb_uri)
        if(connected) console.log("MongoDB Connected Successfully")
    }catch(err){
        console.log("MongoDB Failed to Connect ")
    }
}

export default ConnectDB;