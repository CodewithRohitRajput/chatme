import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    username : String,
    email : String,
    password : String,
    friends : [{ type : mongoose.Schema.Types.ObjectId, ref : 'User' }]
})

export default mongoose.model("User", userSchema)